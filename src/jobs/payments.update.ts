import Web3 from "web3";
import {
  PaymentStatus,
  PaymentReleaseStatus,
} from "../interfaces/payments.interface";

const updatePendingPayments = async (strapi: any) => {
  try {
    // TODO: add cron job time tu run
    console.log("Cron update payments started");

    const web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.INFURA_URL)
    );

    const paymentsInProcess = await strapi.db
      .query("api::payment.payment")
      .findMany({
        where: {
          status: PaymentStatus.inProcess,
          txHash: {
            $notNull: true,
          },
        },
      });

    paymentsInProcess.length &&
      console.log(`Found ${paymentsInProcess.length} in-process payments.`);

    const receipts = await Promise.all(
      paymentsInProcess
        .filter((payment) => payment.txHash)
        .map((payment) => web3.eth.getTransactionReceipt(payment.txHash))
    );

    receipts.length &&
      console.log(`Fetched ${receipts.length} transaction receipts.`);

    // Filter out successful transactions and get their IDs
    const successfulPaymentsTxHashes = receipts
      .filter((receipt) => receipt?.status)
      .map((receipt) => receipt.transactionHash);

    // Update successful transactions
    if (!successfulPaymentsTxHashes?.length) {
      console.log("No successful payments found");
      return;
    }

    console.log(
      `Found ${successfulPaymentsTxHashes.length} successful payments.`
    );
    const currentDate = new Date().toISOString();

    const updatedPayments = await strapi
      .query("api::payment.payment")
      .updateMany({
        where: { txHash: { $in: successfulPaymentsTxHashes } },
        data: {
          status: PaymentStatus.success,
          successDate: currentDate,
          releaseStatus: PaymentReleaseStatus.pending,
        },
      });
    console.log("Updated successful payments:", updatedPayments);
  } catch (error) {
    console.log("Update payments status:", error);
  }
};

export { updatePendingPayments };
