import {
  PaymentStatus,
  PaymentReleaseStatus,
  DepositGuarantyReleaseStatus,
} from "../interfaces/payments.interface";
import { WithdrawalStatus } from "../interfaces/withdrawals.service.iterface";
import TatumService, {
  AMOUNT_BLOCK_TYPE,
  BatchPayment,
} from "../services/tatum.service";
import { hasHoursPassed } from "../utils/date";

/**
 * Releases payments from the system to the respective hosts.
 * Searches for all successful payments and, for each of them, creates a private key and calculates the amount to be released.
 * Then, it sends a transaction to release the payment to the host and updates the release status in the database to 'releasing'.
 *
 * @param {any} strapi - An object providing access to the database and other core features.
 * @throws Will throw an error if the payment release process fails.
 */

const releasePayments = async (strapi: any) => {
  try {
    console.log("Cron release payment started");
    // TODO: add cron job time tu run
    // Get in-process payments
    const payments = await strapi.db.query("api::payment.payment").findMany({
      where: {
        status: PaymentStatus.success,
        releaseStatus: PaymentReleaseStatus.waitingToReleaseTime,
      },
      populate: ["book", "hostVirtualAccount"],
    });

    if (!payments.length) {
      console.log("Not have payments to release");
      return;
    }

    const paymentsToReleaseHosts = payments.filter((payment) => {
      const { from, checkInTime } = payment.book;

      return hasHoursPassed(from, checkInTime, payment.releaseHostTime);
    });

    if (!paymentsToReleaseHosts[0]) {
      console.log("No payments found to release to host");
      return;
    }

    if (!paymentsToReleaseHosts[0]?.hostVirtualAccount) {
      console.log(
        `Payment ${paymentsToReleaseHosts[0].id}, no have a host virtual account`
      );
      return;
    }

    const payment = paymentsToReleaseHosts[0];
    const tatumService = new TatumService();
    await tatumService.unblockAmount(payment.virtualBlockedAmountId);
    await strapi.db.query("api::payment.payment").update({
      where: {
        id: payment.id,
      },
      data: {
        releaseStatus: PaymentReleaseStatus.released,
      },
    });

    console.log(
      `${paymentsToReleaseHosts.length} a payment was released to the host.`
    );
  } catch (error) {
    console.log("Release payments error:", error);
  }
};

const releaseDepositsGuaranties = async (strapi: any) => {
  try {
    console.log("Cron release deposit guaranty started");

    // TODO: add cron job time tu run
    // Get in-process payments
    const payments = await strapi.db.query("api::payment.payment").findMany({
      where: {
        status: PaymentStatus.success,
        releaseDepositStatus: DepositGuarantyReleaseStatus.waitingToReleaseTime,
      },
      populate: ["book", "hostVirtualAccount"],
    });

    if (!payments.length) {
      console.log("Not have deposit guaranty to release");
      return;
    }

    const depositToReleaseGuest = payments.filter((payment) => {
      const { to, checkOutTime } = payment.book;

      return hasHoursPassed(to, checkOutTime, payment.releaseDepositTime);
    });

    if (!depositToReleaseGuest[0]) {
      console.log("No payments found to release to host");
      return;
    }

    if (!depositToReleaseGuest[0]?.hostVirtualAccount) {
      console.log(
        `Deposit guaranty for payment: ${depositToReleaseGuest[0].id} no have a host virtual account`
      );
      return;
    }

    const payment = depositToReleaseGuest[0];
    // MAKE WITHDRAW:
    // const withdrawal = await tatumService.storeWithdrawal({
    //   senderAccountId: process.env.GUARANTY_VIRTUAL_ADDRESS,
    //   address: payment.guestAddress,
    //   amount: payment.depositAmount.toString(),
    //   fee: "0",
    // });

    await strapi.db.query("api::withdrawal.withdrawal").create({
      data: {
        payment: payment.id,
        virtualAccountAddress: process.env.GUARANTY_VIRTUAL_ADDRESS,
        destinationAddress: payment.guestAddress,
        status: WithdrawalStatus.pending,
      },
    });

    await strapi.db.query("api::payment.payment").update({
      where: {
        id: payment.id,
      },
      data: {
        releaseDepositStatus: DepositGuarantyReleaseStatus.inProcess,
      },
    });

    console.log(`${depositToReleaseGuest.length} payments to release to host`);
  } catch (error) {
    console.log("Release deposit guaranty error:", error);
  }
};

/**
 * Updates the status of pending payment releases in the database.
 * Searches for all successful payments that still have a 'pending' release status.
 * For each of them, it retrieves the transaction receipt of the payment release.
 * Then, it filters successful release transactions and updates their release status in the database to 'released'.
 *
 * @param {any} strapi - An object providing access to the database and other core features.
 * @throws Will throw an error if the updating process fails.
 */
const splitPaymentFees = async (strapi: any) => {
  try {
    // TODO: add cron job time tu run
    console.log("Cron split payment started");

    const inProgressReleasePayment = await strapi.db
      .query("api::payment.payment")
      .findOne({
        where: {
          status: PaymentStatus.success,
          releaseStatus: PaymentReleaseStatus.pending,
        },
        populate: ["hostVirtualAccount", "book"],
      });

    if (!inProgressReleasePayment) {
      console.log("No pending payments to split fees");
      return;
    }

    const tatumService = new TatumService();

    const {
      hostVirtualAccount,
      id: paymentId,
      book,
      depositAmount,
      hostRevenueAmount,
      platformRevenue,
    } = inProgressReleasePayment;

    const revenueTransaction: BatchPayment = {
      recipientAccountId: process.env.REVENUE_VIRTUAL_ADDRESS,
      // TODO: check this one
      amount: platformRevenue.toString(),
      transactionCode: book.id.toString(),
      paymentId: paymentId.toString(),
      recipientNote: `CryptoBed revenue from book: ${book.id}`,
      senderNote: `Send revenue account of book: ${book.id}`,
    };

    const guarantyTransaction: BatchPayment = {
      recipientAccountId: process.env.GUARANTY_VIRTUAL_ADDRESS,
      amount: depositAmount.toString(),
      transactionCode: book.id.toString(),
      paymentId: paymentId.toString(),
      recipientNote: `Guaranty from book: ${book.id}`,
      senderNote: `Send guaranty for book: ${book.id}`,
    };

    let transaction = [];

    if (platformRevenue > 0) {
      transaction.push(revenueTransaction);
    }

    if (depositAmount > 0) {
      transaction.push(guarantyTransaction);
    }

    let releasePaymentsInternalsIds = [];

    if (transaction.length) {
      releasePaymentsInternalsIds =
        await tatumService.sendVirtualPaymentInBatch({
          senderAccountId: hostVirtualAccount.accountId,
          transaction,
        });
    }

    const virtualBlockResponse = await tatumService.blockAmount({
      amount: hostRevenueAmount.toString(),
      accountId: hostVirtualAccount.accountId,
      type: `${AMOUNT_BLOCK_TYPE.ESCROW}-${book.id}`,
    });

    const updateResult = await strapi.db.query("api::payment.payment").update({
      where: {
        id: paymentId,
      },
      data: {
        releaseStatus: PaymentReleaseStatus.waitingToReleaseTime,
        releaseDepositStatus: DepositGuarantyReleaseStatus.waitingToReleaseTime,
        splitVirtualPaymentsIds: releasePaymentsInternalsIds,
        virtualBlockedAmountId: virtualBlockResponse.id,
      },
    });

    console.log("Updated payment:", updateResult.id);
  } catch (error) {
    console.log("Update pending release payments:", error);
  }
};

export { releasePayments, splitPaymentFees, releaseDepositsGuaranties };
