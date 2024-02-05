import { factories } from "@strapi/strapi";
import { BLOCKCHAINS, usdtMapping } from "../../../constants";
import TatumService from "../../../services/tatum.service";
import { parseUnits } from "ethers";
import { convertVirtualAccountToAccount } from "../../../converters/accounts";
import {
  PaymentStatus,
  PaymentReleaseStatus,
} from "../../../interfaces/payments.interface";
import { Availability } from "../../../interfaces/book.interface";

export default factories.createCoreController(
  "api::book.book",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const { body } = ctx.request;
        const sanitizedBody = await this.sanitizeInput(body, ctx);

        // Validating dates
        if (new Date(sanitizedBody.from) >= new Date(sanitizedBody.to)) {
          throw new Error(
            "Invalid dates: 'from' date should be before 'to' date."
          );
        }

        const availability: Availability = await strapi
          .service("api::book.book")
          .checkAvailability(
            sanitizedBody.stay,
            sanitizedBody.from,
            sanitizedBody.to
          );

        console.log("availability", availability);

        if (!availability.isAvailable) {
          console.log("Stay not available for the selected dates");
          ctx.status = 409;
          return { message: "Stay not available for the selected dates" };
        }

        const stay = await strapi.db.query("api::stay.stay").findOne({
          where: { id: sanitizedBody.stay },
          populate: ["author"],
        });

        if (!stay) {
          throw new Error("Stay not found");
        }

        const nights = availability.nights;

        // Platform fee 10% by default
        const platformRevenueFee = stay.author?.promotionalFee ?? 0.1;

        // Cleaning service fee
        const cleaningServiceFee = stay?.cleaningServiceFee ?? 0;

        // Deposit Guaranty
        const depositAmount = stay?.depositAmount ?? 0;

        // Total amount to pay by guest
        const totalAmount = (
          stay.price * nights +
          cleaningServiceFee +
          depositAmount
        ).toFixed(2);

        // Platform revenue calc
        const platformRevenue =
          (totalAmount - cleaningServiceFee) * platformRevenueFee;

        // Host revenue calc
        const hostRevenueAmount = totalAmount - platformRevenue;

        // Amount to pay in USDT with 6 decimals
        const amount = parseUnits(totalAmount.toString(), 6);

        sanitizedBody.host = stay.author.id;
        sanitizedBody.priceNight = stay.price;
        sanitizedBody.total = totalAmount;
        sanitizedBody.nights = nights;
        sanitizedBody.publishedAt = new Date();

        const createdRecord = await strapi.db
          .query("api::book.book")
          .create({ data: sanitizedBody });

        const externalId = createdRecord.id.toString();

        const tatumService = new TatumService();

        let virtualAccount = await strapi.db
          .query("api::virtual-account.virtual-account")
          .findOne({
            where: { user: stay.author.id },
            populate: ["*"],
          });

        if (!virtualAccount?.id) {
          const virtualAccountResponse =
            await tatumService.createVirtualAccount({
              currency: stay.preferredCoin.toUpperCase(),
              customer: {
                externalId,
                accountingCurrency: "USD",
              },
              accountNumber: stay.author.username,
            });

          const internalVirtualAccount = {
            ...convertVirtualAccountToAccount(virtualAccountResponse),
            user: stay.author.id,
            publishedAt: new Date(),
          };

          virtualAccount = await strapi.db
            .query("api::virtual-account.virtual-account")
            .create({
              data: internalVirtualAccount,
            });
        }

        const blockchainDeposit =
          await tatumService.createVirtualDepositAddress(
            virtualAccount.accountId
          );

        const tokenData = usdtMapping[BLOCKCHAINS.POLYGON];

        await strapi.db.query("api::payment.payment").create({
          data: {
            hostAddress: stay.author.username,
            guestAddress: createdRecord.guestAddress,
            book: createdRecord.id,
            status: PaymentStatus.inProcess,
            releaseStatus: PaymentReleaseStatus.pending,
            depositAddress: blockchainDeposit.address,
            releaseDepositTime: 24,
            releaseHostTime: 24,
            contractAddress: tokenData.address,
            contractABI: tokenData.ABI,
            publishedAt: new Date(),
            coin: stay.preferredCoin.toUpperCase(),
            hostVirtualAccount: virtualAccount.id,
            bookTotalAmount: totalAmount,
            depositAmount: stay.depositAmount,
            cleaningServiceFee,
            hostRevenueAmount,
            platformRevenue,
            fee: platformRevenueFee,
            amount,
          },
        });

        return this.transformResponse(createdRecord);
      } catch (error) {
        console.error("Error in create booking:", error);
        ctx.status = 500;
        return { message: error.message };
      }
    },

    async findUserBookings(ctx) {
      try {
        const { username } = ctx.state.user;
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const service = strapi.service("api::book.book");
        // @ts-ignore
        const { results, pagination } = await service.find({
          ...sanitizedQueryParams,
          filters: {
            guestAddress: username,
          },
        });

        const resultsFiltered = results?.filter((book) => book.payment) ?? [];

        const sanitizedResults = await this.sanitizeOutput(
          resultsFiltered,
          ctx
        );

        return this.transformResponse(sanitizedResults, { pagination });
      } catch (error) {
        ctx.status = 500;
        return { message: error.message };
      }
    },

    async findUserHostBookings(ctx) {
      try {
        const { username } = ctx.state.user;
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const service = strapi.service("api::book.book");
        // @ts-ignore
        const { results, pagination } = await service.find({
          ...sanitizedQueryParams,
          filters: { host: { username } },
        });

        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults, { pagination });
      } catch (error) {
        ctx.status = 500;
        return { message: error.message };
      }
    },
  })
);
