/**
 * payment service
 */

import { factories } from "@strapi/strapi";
import { PaymentStatus } from "../../../interfaces/payments.interface";

export default factories.createCoreService(
  "api::payment.payment",
  ({ strapi }) => ({
    async updateClaimStatus(
      paymentId: string,
      status: PaymentStatus,
      username: string
    ) {
      try {
        if (status === PaymentStatus.claimedByGuest) {
          return strapi.db.query("api::payment.payment").update({
            where: {
              id: paymentId,
              guestAddress: username,
            },
            data: {
              status,
            },
          });
        }

        if (status === PaymentStatus.claimedByHost) {
          return strapi.db.query("api::payment.payment").update({
            where: {
              id: paymentId,
              hostAddress: username,
            },
            data: {
              status,
            },
          });
        }

        Promise.reject("Not Allowed");
      } catch (error) {
        Promise.reject(error);
      }
    },
  })
);
