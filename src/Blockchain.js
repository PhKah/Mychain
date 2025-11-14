"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sha256 = require('crypto-js/sha256');
const elliptic_1 = require("elliptic");
const ec = new elliptic_1.ec('secp256k1');
class Transaction {
    constructor(sender, reciever, amount) {
        this.sender = sender;
        this.reciever = reciever;
        this.amount = amount;
        this.hash = '';
        this.sender = sender;
        this.reciever = reciever;
        this.amount = amount;
    }
    calculateHash() {
        return this.hash = sha256(this.sender + this.reciever + JSON.stringify(this.amount)).toString();
    }
    createSignature(signer) {
        return sha256(this.hash + signer.getPrivate());
    }
}
class Block {
    constructor(timestamp, transactions, previousHash = '', hash = '', nonce = 0) {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = hash;
        this.nonce = nonce;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
    }
    calculateHash() {
        return sha256(this.previousHash +
            String(this.timestamp) +
            JSON.stringify(this.transactions + this.nonce)).toString();
    }
    mineBlock(difficulty) {
        console.log("Mining...");
        while (this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("hash: " + this.hash);
    }
}
class Blockchain {
    constructor(chain, difficulty, mempool, reward) {
        this.chain = chain;
        this.difficulty = difficulty;
        this.mempool = mempool;
        this.reward = reward;
        this.chain = [this.createGenesis()];
        this.mempool = [];
        this.difficulty = difficulty;
        this.reward = reward;
    }
    createGenesis() {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }
    getLatesBlock() {
        return this.chain[this.chain.length - 1];
    }
    Mining(miner) {
        let block = new Block(Date.now(), this.mempool[0]);
        block.mineBlock(this.difficulty);
        console.log("Block suscessfuly mined");
        this.chain.push(block);
    }
    IsChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            let cur = this.chain[i];
            let prv = this.chain[i - 1];
            if (cur.previousHash != prv.hash || cur.calculateHash() != cur.hash)
                return false;
        }
        return true;
    }
}
console.log(sha256("1") + "\n" + sha256("1"));
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
