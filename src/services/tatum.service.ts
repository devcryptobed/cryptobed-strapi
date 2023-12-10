import fetch from "node-fetch";
import { BLOCKCHAINS, TOKENS } from "../constants";

export interface VirtualAddress {
  address: string;
  currency: string;
  derivationKey: number;
  xpub: string;
  destinationTag: number;
  memo: string;
  message: string;
}

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

export interface InternalVirtualAccount {
  accountId: string;
  accountBalance: string;
  availableBalance: string;
  currency: string;
  frozen: boolean;
  active: boolean;
  customerId: string;
  accountNumber: string;
  accountCode: string;
  accountingCurrency: string;
  xpub: string;
}

export interface VirtualAccountPayload {
  currency: string;
  xpub?: string;
  customer: {
    externalId: string;
    accountingCurrency: "USD" | "EUR";
  };
  accountNumber: string;
}

export interface DepositAddress {
  address: string;
  currency: string;
  derivationKey: number;
  xpub: string;
  destinationTag: number;
  memo: string;
  message: string;
}

export interface Balance {
  accountBalance: string;
  availableBalance: string;
}

export interface Wallet {
  mnemonic: string;
  xpub: string;
}

export interface ExtendedAddressResponse {
  address: string;
}
export interface PrivateKeyResponse {
  key: string;
}
export interface SendTxPayload {
  to: string;
  amount: string;
  currency: string;
  fromPrivateKey: string;
}

export interface TransactionResponse {
  txId: string;
}

export interface VirtualPaymentPayload {
  senderAccountId: string;
  recipientAccountId: string;
  amount: string;
}

export interface VirtualBatchPaymentPayload {
  senderAccountId: string;
  transaction: BatchPayment[];
}

export interface EstimateFeesPayload {
  from: string;
  to: string;
  contractAddress?: string;
  amount: string;
  data?: string;
}

export interface BatchPayment {
  recipientAccountId: string;
  amount: string;
  anonymous?: boolean;
  compliant?: boolean;
  transactionCode: string;
  paymentId: string;
  recipientNote?: string;
  baseRate?: number;
  senderNote?: string;
}

export interface TxToERC20Payload {
  senderAccountId: string;
  address: string;
  amount: string;
  privateKey: string;
}
export interface TxToERC20Response {
  id: string;
  txId: string;
  completed: string;
}
export interface FeeRecommendation {
  fast: number;
  medium: number;
  slow: number;
  baseFee: number;
  time: Date;
  block: number;
}

export interface FeeTransactionEstimation {
  gasLimit: string;
  gasPrice: string;
  estimations: Estimations;
}

export interface Estimations {
  safe: string;
  standard: string;
  fast: string;
  baseFee: string;
}

export interface BlockVirtualAccountAmountPayload {
  accountId: string;
  amount: string;
  type: string;
}
export interface BlockVirtualAccountAmountResponse {
  id: string;
}

export enum AMOUNT_BLOCK_TYPE {
  ESCROW = "escrow-waiting-check-in-book",
  ESCROW_MEDIATION = "escrow-waiting-mediation-book",
}

export interface WithdrawalPayload {
  senderAccountId: string;
  address: string;
  amount: string;
  fee: string;
}

export interface WithdrawalResponse {
  reference: string;
  data: WithdrawalData[];
  id: string;
}

export interface WithdrawalData {
  address: WithdrawalAddress;
  amount: number;
  vIn: string;
  vInIndex: number;
  scriptPubKey: string;
}

export interface WithdrawalAddress {
  address: string;
  currency: string;
  derivationKey: number;
  xpub: string;
  destinationTag: number;
  memo: string;
  message: string;
}

class TatumService {
  baseUrl: string;
  apiKey: string;

  constructor() {
    this.baseUrl = process.env.TATUM_API_URL;
    this.apiKey = process.env.TATUM_API_KEY;
  }

  async createVirtualAccount(
    payload: VirtualAccountPayload
  ): Promise<VirtualAccount> {
    const resp = await fetch(`${this.baseUrl}/ledger/account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({ ...payload, xpub: process.env.TATUM_XPUB }),
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async createVirtualDepositAddress(
    virtualAccountId: string
  ): Promise<DepositAddress> {
    const resp = await fetch(
      `${this.baseUrl}/offchain/account/${virtualAccountId}/address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
      }
    );

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async sendPaymentToVirtualAccount(
    payload: VirtualPaymentPayload
  ): Promise<VirtualAccount> {
    const resp = await fetch(`${this.baseUrl}/ledger/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async createWallet(blockchain: BLOCKCHAINS): Promise<Wallet> {
    const resp = await fetch(`${this.baseUrl}/${blockchain}/wallet`, {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey,
      },
    });

    return resp.json();
  }

  async createExtendedAddress(
    blockchain: BLOCKCHAINS,
    index: string
  ): Promise<ExtendedAddressResponse> {
    const resp = await fetch(
      `${this.baseUrl}/${blockchain}/address/${process.env.TATUM_XPUB}/${index}`,
      {
        method: "GET",
        headers: {
          "x-api-key": this.apiKey,
        },
      }
    );

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async createPrivateKey(
    blockchain: BLOCKCHAINS,
    index: string
  ): Promise<PrivateKeyResponse> {
    const resp = await fetch(`${this.baseUrl}/${blockchain}/wallet/priv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({
        mnemonic: process.env.TATUM_MNEMONIC,
        index,
      }),
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async sendVirtualPayment(
    payload: SendTxPayload
  ): Promise<TransactionResponse> {
    const resp = await fetch(`${this.baseUrl}/ledger/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async sendVirtualPaymentInBatch(
    payload: VirtualBatchPaymentPayload
  ): Promise<string[]> {
    const resp = await fetch(`${this.baseUrl}/ledger/transaction/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }
  async blockAmount(
    payload: BlockVirtualAccountAmountPayload
  ): Promise<BlockVirtualAccountAmountResponse> {
    const { accountId, amount, type } = payload;

    const resp = await fetch(
      `${this.baseUrl}/ledger/account/block/${accountId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({
          amount,
          type,
        }),
      }
    );

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async unblockAmount(blockId: string): Promise<void> {
    const resp = await fetch(
      `${this.baseUrl}/ledger/account/block/${blockId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
      }
    );

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return Promise.resolve();
  }

  async getTransactionFees(payload: EstimateFeesPayload): Promise<string[]> {
    const resp = await fetch(`${this.baseUrl}/ethereum/gas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async getETHRecommendedFee(): Promise<FeeTransactionEstimation> {
    const resp = await fetch(`${this.baseUrl}/blockchain/fee/ETH`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async sendTxToERC20(payload: TxToERC20Payload): Promise<TxToERC20Response> {
    const resp = await fetch(
      `${this.baseUrl}/offchain/ethereum/erc20/transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }
  async storeWithdrawal(
    payload: WithdrawalPayload
  ): Promise<WithdrawalResponse> {
    const resp = await fetch(`${this.baseUrl}/offchain/withdrawal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }

  async getVirtualAccount(id: string): Promise<VirtualAccount> {
    const resp = await fetch(`${this.baseUrl}/ledger/account/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
    });

    if (!resp.ok) {
      return Promise.reject(resp);
    }

    return resp.json();
  }
}

export default TatumService;
