import Web3, { Transaction } from "web3";

class MonitorEth {
  private web3: Web3;
  private lastSyncedBlock: number | null;

  constructor(httpProvider: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
    this.lastSyncedBlock = null;
  }

  async initializeLastSyncedBlock(): Promise<void> {
    const lastBlockNumber = await this.getLastBlockNumber();
    this.lastSyncedBlock = Number(this.lastSyncedBlock);
  }

  async getBlock(blockNumber: number): Promise<any> {
    return this.web3.eth.getBlock(blockNumber, true);
  }

  async getLastBlockNumber(): Promise<bigint> {
    return this.web3.eth.getBlockNumber();
  }

  async searchTransaction(to: string): Promise<void> {
    const lastBlock = await this.getLastBlockNumber();
    console.log(
      `Searching blocks: ${this.lastSyncedBlock! + 1} - ${lastBlock}`
    );

    for (
      let blockNumber = this.lastSyncedBlock! + 1;
      blockNumber < lastBlock;
      blockNumber++
    ) {
      const block = await this.getBlock(blockNumber);

      if (!block?.transactions) {
        continue;
      }
      for (const tx of block.transactions as Transaction[]) {
        if (!tx?.to) {
          continue;
        }
        if (tx.to.toLowerCase() === to.toLowerCase()) {
          console.log(tx);
        }
      }
    }
    this.lastSyncedBlock = Number(lastBlock);
    console.log(
      `Finished searching blocks: ${this.lastSyncedBlock + 1} - ${lastBlock}`
    );
  }
}

export default MonitorEth;
