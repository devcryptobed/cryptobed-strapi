/**
 * payment controller
 */

import { factories } from "@strapi/strapi";
import TatumService from "../../../services/tatum.service";
import { PaymentStatus } from "../../../interfaces/payments.interface";

export default factories.createCoreController(
  "api::payment.payment",
  ({ strapi }) => ({
    async getRecommendedFee(ctx) {
      try {
        if (!ctx?.params?.id) {
          return { message: "error" };
        }
        const tatumService = new TatumService();
        const { depositAddress, contractAddress } = await strapi.db
          .query("api::payment.payment")
          .findOne({ where: { id: ctx?.params?.id } });

        const fees = await tatumService.getTransactionFees({
          from: ctx.state.user.username,
          to: depositAddress,
          contractAddress,
          amount: "0",
          // TODO: maybe is necessary to add tx data from fe
          // data: string,
        });
        return fees;
      } catch (error) {
        console.log(error);
        return { message: "error" };
      }
    },
    async claimPayment(ctx) {
      try {
        const { username } = ctx.state.user;
        const { body } = ctx.request;
        const {
          data: { status },
        } = await this.sanitizeInput(body, ctx);
        const { id } = ctx.params;

        await strapi
          .service("api::payment.payment")
          .updateClaimStatus(id, status, username);

        ctx.send({
          ok: true,
        });
      } catch (error) {
        ctx.status = 404;
        return { message: "Not Allowed" };
      }
    },
  })
);
