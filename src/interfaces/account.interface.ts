export interface VirtualAccount {
  id: string;
  balance: Balance;
  currency: string;
  frozen: boolean;
  active: boolean;
  customerId: string;
  accountNumber: string;
  accountCode: string;
  accountingCurrency: string;
  xpub: string;
}

export interface Balance {
  accountBalance: string;
  availableBalance: string;
}
