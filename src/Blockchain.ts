const sha256 = require('crypto-js/sha256');
import { Instruction } from '@metaplex-foundation/umi';
import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');

class Coin {
    public spent: boolean = false;
    constructor (
        public tx: string,
        public vout: number,
        public value: number,
        public scriptPubKey: string
    ) {
        this.tx = tx;
        this.vout = vout; 
        this.value = value;
        this.scriptPubKey = scriptPubKey;
    }
}

class Wallet {
    public uxtoList: Coin[] = [];
    constructor (
        public owner: string
    ){
        this.owner = owner;
    }
    getBalance() {
        let balance: number = 0;
        for(const uxto of this.uxtoList)
            balance += uxto.value;
        return balance;
    }
    createInputs(transaction: Transaction)
    {
        let minimum: number = transaction.fee;
        for(const trans of transaction.instruction)
            minimum += trans.amount;
        if(minimum > this.getBalance())
            throw new Error("Balance not enough");
        let lst: Coin[] = [];
        let val: number = 0;
        while(val < minimum)
        {
            lst.push(this.uxtoList[this.uxtoList.length - 1]);
            val += lst[lst.length - 1].value;
            this.uxtoList.length--;
        }
        return lst;
    }
    listen()
    {
        while(true) {
        const block: Block = network.getLatestBlock();
        for(const trans of block.transaction)
            for(const out of trans.output)
                if(sha256(this.owner) == out.scriptPubKey) this.uxtoList.push(out);
        setInterval(() => {}, 5 * 60 * 1000);
        }
    }
}

class Transfer {
    constructor (
        public fromAddress: string,
        public toAddress: string,
        public amount: number
    ) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Transaction {
    public signature: string = '';
    public merkleProof: string[] = [];
    public merkleRoot: string = '';
    public proof: string[] = [];
    public instruction: Transfer[] = [];
    public input: Coin[] = [];
    public output: Coin[] = [];
    constructor(
        public sender: string,
        public fee: number = fee
    ) {
        this.sender = sender;
        this.fee = fee;
    }
    calculateHash()
    {
        return "";
    }
    addInstruction(ins: Transfer)
    {
        if(ins.fromAddress != this.sender)
            throw new Error("Wrong sender address");
        this.instruction.push(ins);
    }
    signTransaction(signer: EC.KeyPair)
    {
        if(signer.getPublic('hex') != this.sender)
        {
            throw new Error("You can't sign transaction of other wallets!");
        }
        const hashTx = this.calculateHash();
        const sig = signer.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }
    createOutputs()
    {
        let total: number = 0, id: number = 0;
        for(const it of this.input)
            total += it.value;
        total -= this.fee;
        for(const ins of this.instruction)
        {
            total -= ins.amount
            let out: Coin = new Coin(this.signature,id,ins.amount,sha256(ins.toAddress));
            this.output.push(out);
            id++;
        }
        this.output.push(new Coin(this.signature,id,total,sha256(this.sender)));
    }
    isValid()
    {
        if(this.sender == null) return true;
        if(!this.signature || this.signature.length == 0)
            {
                console.log("This transaction isn't signed");
                return false;
            }
        if(this.input.length == 0)
            {
                console.log("Sender hasn't provided inputs");
                return false;
            }
        const publicKey = ec.keyFromPublic(this.sender,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}

class Block {
    public transaction: Transaction[] = [];
    public hash: string = '';
    public nonce: number = 0;
    public size: number = 8;
    public merkleRoot: string = "";
    public mt: string[] = [];
    public proof: string[] = [];
    constructor (
        public timestamp: number, 
        public previousHash: string
    ) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
    }
    calculateHash()
    {
        return sha256(
            this.previousHash +
            String(this.timestamp) +
            this.merkleRoot +
            String(this.nonce)
        ).toString();
    }
    mineBlock(difficulty : number)
    {
        console.log("Mining...")
        this.merkleTree(1, 0, this.transaction.length - 1);                                                                             
        this.merkleProof(1, 0, this.transaction.length - 1);
        this.merkleRoot = this.mt[1];
        while(this.hash.substring(0,difficulty) != Array(difficulty + 1).join("0"))
        {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
    isBlockValid()
    {
        this.merkleTree(1, 0, this.transaction.length - 1);
        if(this.mt[1] != this.merkleRoot) return false;
        return true;
    }
    merkleTree(id: number, l : number, r : number)
    {
        if(l > r) return;
        if(l == r) 
        {
            this.mt[id] = this.transaction[l].signature;
            return;
        }
        const mid = (l + r) / 2;
        this.merkleTree(id*2, l , mid);
        this.merkleTree(id*2+1, mid + 1, r);
        this.mt[id] = sha256(this.mt[id*2] + this.mt[id*2+1]);
    }
    merkleProof(id: number, l: number, r: number)
    {
        if(l > r) return;
        if(l == r)
        {
            let sibling: string;
            if(id % 2) sibling = this.mt[id - 1];
            else sibling = this.mt[id + 1];
            this.transaction[l].proof.push(sibling);
            this.transaction[l].proof.concat(this.proof);
            this.transaction[l].merkleRoot = this.mt[1];
            return;
        }
        const mid = (l + r) / 2;
        if(id != 1)
        {
            let sibling: string;
            if(id % 2) sibling = this.mt[id - 1];
            else sibling = this.mt[id + 1];
        }
        this.merkleProof(id * 2, l, mid);
        this.merkleProof(id * 2 + 1, mid + 1, r);
        this.proof.length--;
    }
    
}

class Blockchain {
    public mempool: Transaction[] = [];
    public chain: Block[] = [this.createGenesis()];
    constructor(
        public difficulty: number,
        public reward: number
    ) {
        this.difficulty = difficulty;
        this.reward = reward;
    }
    createGenesis(): Block {
        return new Block(Date.now(), "Genesis Block");
    }
    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }
    Mining(miner: string){
        let block = new Block(Date.now(),this.getLatestBlock().hash);
        for(let i = 1; i <= block.size; i++)
        {
            block.transaction.push(this.mempool[this.mempool.length - 1]);
            this.mempool.length--;
        }
        block.mineBlock(this.difficulty);
        for(const trans of block.transaction)
            trans.createOutputs();
        console.log("Block suscessfuly mined");
        this.chain.push(block);
    }
    addTransaction(trans : Transaction)
    {
        if(!trans.isValid())
            throw new Error("Transaction not valid");
        this.mempool.push(trans);
    }
    isChainValid(): any {
        for(let i: number = 1; i < this.chain.length; i++)
        {
            let cur: Block = this.chain[i];
            let prv: Block = this.chain[i-1];
            if(cur.previousHash != prv.hash || cur.calculateHash() != cur.hash || !cur.isBlockValid())
                return false;
        }
        return true;
    } 
}
let network: Blockchain = new Blockchain(2,1);
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;