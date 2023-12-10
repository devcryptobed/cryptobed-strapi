/**
 * stay controller
 */

import { factories } from "@strapi/strapi";
import { ApiStayStay } from "../../../../schemas";
import { ServiceResponse } from "../../../interfaces/service";

export default factories.createCoreController(
  "api::stay.stay",
  ({ strapi }) => ({
    async findUserStays(ctx) {
      try {
        const { username } = ctx.state.user;
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);

        const { results, pagination } = await (strapi
          .service("api::stay.stay")
          .find({
            ...sanitizedQueryParams,
            filters: { author: { username } },
          }) as Promise<ServiceResponse<ApiStayStay, "attributes">>);

        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults, { pagination });
      } catch (error) {
        console.log(error);
        return { message: "error" };
      }
    },
    async create(ctx) {
      try {
        const { body } = ctx.request;
        const sanitizedBody = await this.sanitizeInput(body, ctx);

        if (sanitizedBody.data) {
          sanitizedBody.data.author = ctx.state.user.id;
          sanitizedBody.data.publishedAt = new Date();
        }

        const createdRecord = await strapi.db
          .query("api::stay.stay")
          .create(sanitizedBody)
          .catch((error) => {
            console.log(error.message);
          });

        return this.transformResponse(createdRecord);
      } catch (error) {
        console.log(error);
        ctx.status = 400;
        return { message: "Not Created" };
      }
    },
  })
);
