"use strict";

const { sanitize } = require("@strapi/utils");

module.exports = {
  /**
   * Generate auth token and return it
   * @param ctx
   * @returns {Promise<void>}
   */
  async authToken(ctx) {
    console.log(ctx.params.address);
    // Sanitize address
    const address = strapi
      .plugin("webthree-auth")
      .service("webthreeAuthService")
      .sanitizeAddress(ctx.params.address);
    if (!address) {
      ctx.send({
        success: false,
        error: "Invalid address",
      });
      return;
    }

    // Generate a new token
    const token = strapi
      .plugin("webthree-auth")
      .service("webthreeAuthService")
      .generateToken();

    // Find user by address
    let user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { address } });

    if (!user) {
      // Create user in database if not exists
      user = await strapi
        .plugin("webthree-auth")
        .service("webthreeAuthService")
        .createUser({
          address,
          username: address,
          confirmed: false,
          blocked: false,
          token: token,
        });
    } else {
      // Update user token in database
      user = await strapi
        .plugin("webthree-auth")
        .service("webthreeAuthService")
        .updateUserToken(address, token);
    }

    // Return token
    ctx.send({ token });
  },

  async authenticate(ctx) {
    // Sanitize address
    const address = strapi
      .plugin("webthree-auth")
      .service("webthreeAuthService")
      .sanitizeAddress(ctx.params.address);
    if (!address) {
      ctx.status = 404;
      ctx.send({
        success: false,
        error: "Address not found",
      });
      return;
    }

    // Find user by address
    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { address } });
    if (!user) {
      ctx.status = 404;
      ctx.send({
        success: false,
        error: "User not found",
      });
      return;
    }

    // Verify signature
    const signatureIsValid = await strapi
      .plugin("webthree-auth")
      .service("webthreeAuthService")
      .verifySignature(address, ctx.params.signature);
    if (!signatureIsValid) {
      ctx.status = 401;
      ctx.send({
        success: false,
        error: "Invalid signature",
      });
      return;
    }

    // If the user account is not confirmed, update it in database
    if (user.confirmed === false) {
      await strapi
        .plugin("webthree-auth")
        .service("webthreeAuthService")
        .confirmUserByAddress(address);
    }

    // Sanitize user data
    const { jwt: jwtService } = strapi.plugins["users-permissions"].services;
    const userSchema = strapi.getModel("plugin::users-permissions.user");
    const sanitizedUserInfo = await sanitize.sanitizers.defaultSanitizeOutput(
      userSchema,
      user
    );

    // Send JWT token & user data
    ctx.send({
      jwt: jwtService.issue({ id: user.id }),
      user: sanitizedUserInfo,
    });
  },
};
