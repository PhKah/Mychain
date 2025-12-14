import {Pool, QueryResult} from 'mysql2/promise';
import {Block, Transaction} from '../Blockchain.ts'

export class IndexerService {
    private dbPool: Pool;
    constructor (pool: Pool) {
        this.dbPool = pool;
    }

    public async indexBlock(block: Block): Promise<void> {
        try {
            const blockQuery = `
                insert into Blocks (hash, previousHash, timestamp, nonce, merkleRoot)
                values (?, ?, ?, ?, ?)
            `;
            const blockVal = [block.hash, block.previousHash, block.timestamp, block.nonce, block.merkleRoot];
            await this.dbPool.query(blockQuery,blockVal);

            const transactionQuery = `
                insert into transactions (hash, blockHash, owner, fee, signature) 
                values ?
            `;
            const transactionVal = block.transaction.map(tx => [
                tx.calculateHash(),
                block.hash, 
                tx.owner, 
                tx.fee,
                tx.signature
            ]);
            await this.dbPool.query(transactionQuery,[transactionVal]);
        } catch(error) {
            console.error('Failed to index block', error);
        }
    }
    public async findTransaction (hash: string): Promise <any | null> {
        const query = `
            select * from transactions where hash = ?
        `;
        const [rows] = await this.dbPool.query(query, [hash]);
        const result = (rows as any[])[0] ?? null;
        return result;
    }
    public async findBlockByHash (hash: string): Promise <any | null> { 
        const query = `
            select * from blocks where hash = ?
        `;
        const [rows] = await this.dbPool.query(query, [hash]);
        const result = (rows as any[])[0] ?? null;
        return result;
    }
}