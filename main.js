var sha256 = require('crypto-js/sha256');
var Block = /** @class */ (function () {
    function Block(index, timestamp, data, previousHash, hash) {
        if (previousHash === void 0) { previousHash = ''; }
        if (hash === void 0) { hash = ''; }
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = hash;
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    Block.prototype.calculateHash = function () {
        return sha256(String(this.index) +
            this.previousHash +
            String(this.timestamp) +
            JSON.stringify(this.data)).toString();
    };
    return Block;
}());
var Blockchain = /** @class */ (function () {
    function Blockchain(chain) {
        this.chain = chain;
        this.chain = [this.createGenesis()];
    }
    Blockchain.prototype.createGenesis = function () {
        return new Block(0, Date.now(), "Genesis Block", "0");
    };
    Blockchain.prototype.getLatesBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    Blockchain.prototype.addBlock = function (newBlock) {
        newBlock.previousHash = this.getLatesBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    };
    Blockchain.prototype.IsChainValid = function () {
        for (var i = 1; i < this.chain.length; i++) {
            var cur = this.chain[i];
            var prv = this.chain[i - 1];
            if (cur.previousHash != prv.hash || cur.calculateHash() != cur.hash)
                return false;
        }
        return true;
    };
    return Blockchain;
}());
var kahchain = new Blockchain([]);
kahchain.createGenesis();
kahchain.addBlock(new Block(1, Date.now(), 4));
kahchain.addBlock(new Block(2, Date.now(), 100));
console.log(kahchain.IsChainValid());
