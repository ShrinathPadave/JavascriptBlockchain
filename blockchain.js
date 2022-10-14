const SHA256 = require('crypto-js/sha256');
const EC  = require('elliptic').ec;
const ec  = new EC('secp256k1');

class Transaction
{
    constructor(fromAddress,toAddress,amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash()
    {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey)
    {
        if(signingKey.getPublic('hex') !== this.fromAddress)
        {
           throw new Error("You cannot sign transaction"); 
        }
        const hashTx = this.calculateHash();
        const sig =signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid()
    {
        if(this.fromAddress ===  null) return true;

        if(!this.signature || this.signature.length === 0)
        {
            throw new Error('No signature is this transction....!');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}

class Block
{
    constructor(timestamp, transactions, previousHash = '')
    {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash()
    {
        return SHA256(this.index + this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
    }

    mineBlock(diffculty)
    {
        while(this.hash.substring(0,diffculty) !== Array(diffculty+1).join("0"))
        {
            this.hash = this.calculateHash();
            this.nonce++;
        }
        console.log("Block mined " + this.hash);
    }

    hasValidTransactions()
    {
        for(const tx of this.transactions)
        {
            if(!tx.isValid())
            {
                return false;
            }
        }
        return true;
    }
}
 class Blockchain
 {
     constructor()
     {
         this.chain = [this.createGenesisBlock()];
         this.diffculty = 4;
         this.pendingTransactions = [];
         this.miningReward = 100;
     }
    
     createGenesisBlock()
     {
         return new Block("10/ 08/ 2021","GenesisBlaock","0");
     }

     getLatestBlock()
     {
         return this.chain[this.chain.length -1];
     }

     minePendingTransactions(miningRewardAddress)
     {
      const rewardTx  = new Transaction(null,miningRewardAddress,this.miningReward);
      this.pendingTransactions.push(rewardTx);
      
      let block  = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock.hash);
      block.mineBlock(this.diffculty);

      console.log("Block successfully mined....");
      this.chain.push(block);

      this.pendingTransactions = [];

    }

    addTransaction(transaction)
    {
        if (!transaction.fromAddress || !transaction.toAddress)
        {
            throw new Error('Cannot add new transactions .....');
        }

        if (!transaction.isValid())
        {
            throw new Error('Caonnot add invalid transaction...!');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanaceAddress(address)
    {
        let balance = 0;
        for (const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(trans.fromAddress === address)
                {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address)
                {
                    balance  += trans.amount;
                }
            }
        }
        return balance;
    }

     isChainVlaid()
     {
         for(let i = 1 ; i < this.chain.length; i++)
         {
             const currentBlock = this.chain[i];
             const previousBlock = this.chain[i-1];

             if(!currentBlock.hasValidTransactions())
             {
                 return false;
             }

             if(currentBlock.hash !== currentBlock.calculateHash())
             {
                 return false;
             }
             if(currentBlock.previousHash !== previousBlock.hash)
             {
                 return false;
             }
             return true;
         }
     }
 }

 module.exports.Blockchain = Blockchain;
 module.exports.Transaction = Transaction;