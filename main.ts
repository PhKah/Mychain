const sha256 = require('crypto-js/sha256');

class Block {
    constructor (
        public index: number, 
        public timestamp: number, 
        public data: any, 
        public previousHash: string = '',
        public hash: string = ''
    ) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash()
    {
        return sha256(
            String(this.index) +
            this.previousHash +
            String(this.timestamp) +
            JSON.stringify(this.data)
        ).toString();
    }
}

class Blockchain {
    constructor(public chain: Block[]) {
        this.chain = [this.createGenesis()];
    }
    createGenesis(): Block {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }
    getLatesBlock(): Block {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock: Block) {
        newBlock.previousHash = this.getLatesBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    IsChainValid(): any {
        for(let i: number = 1; i < this.chain.length; i++)
        {
            let cur: Block = this.chain[i];
            let prv: Block = this.chain[i-1];
            if(cur.previousHash != prv.hash || cur.calculateHash() != cur.hash)
                return false;
        }
        return true;
    }   
}

let kahchain: Blockchain = new Blockchain ([]);
kahchain.createGenesis();
kahchain.addBlock(new Block(1, Date.now(), 4));
kahchain.addBlock(new Block(2, Date.now(), 100));
console.log(kahchain.IsChainValid());