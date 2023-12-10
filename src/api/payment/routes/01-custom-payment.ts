export default {
  routes: [
    {
      method: "GET",
      path: "/payments/:id/blockchain/fees",
      handler: "payment.getRecommendedFee",
    },
    {
      method: "PUT",
      path: "/payments/:id/claim",
      handler: "payment.claimPayment",
    },
  ],
};
