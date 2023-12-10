export enum PaymentStatus {
  waitingForPayment = "waiting-for-payment",
  success = "success",
  rejected = "rejected",
  inProcess = "in-process",
  paused = "paused",
  claimedByGuest = "claimed-by-guest",
  claimedByHost = "claimed-by-host",
}

export enum PaymentReleaseStatus {
  released = "released",
  pending = "pending",
  inProcess = "in-process",
  waitingToReleaseTime = "waiting-to-release-time",
}

export enum DepositGuarantyReleaseStatus {
  pending = "pending",
  released = "released",
  inProcess = "in-process",
  blocked = "blocked",
  waitingToReleaseTime = "waiting-to-release-time",
}
