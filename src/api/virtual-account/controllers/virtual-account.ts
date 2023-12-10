/**
 * virtual-account controller
 */

import { factories } from "@strapi/strapi";
import TatumService from "../../../services/tatum.service";

export default factories.createCoreController(
  "api::virtual-account.virtual-account",
  ({ strapi }) => ({
    async getVirtualAccount(ctx) {
      const { id } = ctx.state.user;
      console.log("user", ctx.state.user);

      try {
        const { accountId } = await strapi.db
          .query("api::virtual-account.virtual-account")
          .findOne({
            where: { user: id },
            populate: ["*"],
          });

        console.log("");

        if (!accountId) {
          throw new Error("Account not found");
        }

        const tatumService = new TatumService();

        const {
          currency,
          balance: { accountBalance, availableBalance },
          frozen,
        } = await tatumService.getVirtualAccount(accountId);

        return {
          currency,
          accountBalance,
          availableBalance,
          frozen,
        };
      } catch (error) {
        console.log(error);
        return {};
      }
    },
  })
);
