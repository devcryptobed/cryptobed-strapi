import { updatePendingPayments } from "../src/jobs/payments.update";
import {
  releaseDepositsGuaranties,
  releasePayments,
  splitPaymentFees,
} from "../src/jobs/payments.release";

export default {
  "*/1 * * * *": async ({ strapi }) => {
    try {
      await updatePendingPayments(strapi);
      await splitPaymentFees(strapi);
    } catch (error) {
      console.log("cron */1 * * * * error:", error);
    }
  },
  "*/2 * * * *": async ({ strapi }) => {
    try {
      await releasePayments(strapi);
      await releaseDepositsGuaranties(strapi);
    } catch (error) {
      console.log("cron */2 * * * * error:", error);
    }
  },
};
