import {
  InternalVirtualAccount,
  VirtualAccount,
} from "../services/tatum.service";

export function convertVirtualAccountToAccount(
  virtualAccount: VirtualAccount
): InternalVirtualAccount {
  return {
    accountId: virtualAccount.id,
    accountBalance: virtualAccount.balance.accountBalance,
    availableBalance: virtualAccount.balance.availableBalance,
    currency: virtualAccount.currency,
    frozen: virtualAccount.frozen,
    active: virtualAccount.active,
    customerId: virtualAccount.customerId,
    accountNumber: virtualAccount.accountNumber,
    accountCode: virtualAccount.accountCode,
    accountingCurrency: virtualAccount.accountingCurrency,
    xpub: virtualAccount.xpub,
  };
}
