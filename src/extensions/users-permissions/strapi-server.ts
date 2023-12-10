module.exports = (plugin) => {
  plugin.controllers.user.updateMe = async (ctx) => {
    console.log(ctx.request.body);
    const { email, phoneNumber, about } = ctx.request.body;
    await strapi
      .query("plugin::users-permissions.user")
      .update({
        where: { id: ctx.state.user.id },
        data: { email, phoneNumber, about },
      })
      .then((res) => {
        ctx.response.status = 200;
      });
  };

  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/user/me/update",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};
