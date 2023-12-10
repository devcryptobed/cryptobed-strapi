export default {
  routes: [
    {
      method: "GET",
      path: "/stays/me",
      handler: "stay.findUserStays",
    },
  ],
};
