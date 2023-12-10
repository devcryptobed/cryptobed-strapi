import { factories } from "@strapi/strapi";
import { Availability } from "../../../interfaces/book.interface";
import { calculateDifferenceInNights } from "../../../utils/date";
const { parseISO, differenceInDays, addDays, format } = require("date-fns");

export default factories.createCoreService("api::book.book", ({ strapi }) => ({
  async getReservedDatesForStay(stayId: string): Promise<string[]> {
    const bookings = await strapi.entityService.findMany("api::book.book", {
      filters: {
        stay: stayId,
      },
    });

    let reservedDates: string[] = [];

    for (const booking of bookings) {
      const startDate = parseISO(booking.from);
      const endDate = parseISO(booking.to);
      const daysDifference = differenceInDays(endDate, startDate);

      for (let i = 0; i < daysDifference; i++) {
        const currentDay = addDays(startDate, i);
        reservedDates.push(format(currentDay, "yyyy-MM-dd"));
      }
    }

    return reservedDates;
  },
  async checkAvailability(
    stayId: string,
    from: string,
    to: string
  ): Promise<Availability> {
    const reservedDates = await this.getReservedDatesForStay(stayId);

    const startDate = parseISO(from);
    const endDate = parseISO(to);

    let isAvailable = true;

    for (let i = 0; i < differenceInDays(endDate, startDate); i++) {
      const currentDay = format(addDays(startDate, i), "yyyy-MM-dd");
      if (reservedDates.includes(currentDay)) {
        isAvailable = false;
        break;
      }
    }

    const nights = calculateDifferenceInNights(from, to);

    return {
      nights,
      reservedDates,
      isAvailable,
    };
  },
}));
