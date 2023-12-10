export default {
  routes: [
    {
      method: "GET",
      path: "/virtual-accounts/me",
      handler: "virtual-account.getVirtualAccount",
    },
  ],
};
