export default {
  routes: [
    {
      method: "GET",
      path: "/books/me",
      handler: "book.findUserBookings",
    },
    {
      method: "GET",
      path: "/books/host",
      handler: "book.findUserHostBookings",
    },
    {
      method: "GET",
      path: "/books/:id/me",
      handler: "book.findUserBooking",
    },
  ],
};
