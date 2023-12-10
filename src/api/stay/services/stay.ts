/**
 * stay service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::stay.stay", ({ strapi }) => ({
  async findOne(entityId, params = {}) {
    const stay = await strapi.entityService.findOne(
      "api::stay.stay",
      entityId,
      this.getFetchParams(params)
    );

    const reservedDates: string[] = await strapi
      .service("api::book.book")
      .getReservedDatesForStay(entityId);

    stay.reservedDates = reservedDates;

    return stay;
  },
}));
