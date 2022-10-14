const {Blockchain,Transaction} = require('./blockchain');
const EC  = require('elliptic').ec;
const ec  = new EC('secp256k1');

const myKey = ec.keyFromPrivate('ee2d1d82aad3cbd7ecfd5fae8b5f463d63c97c7cebf7c10918c41a31bbf82cb7');
const myWalleteAddress = myKey.getPublic('hex');

let SPcoin = new Blockchain();

const Tx1  = new Transaction(myWalleteAddress, 'public key goes here', 10);
Tx1.signTransaction(myKey);
SPcoin.addTransaction(Tx1);

console.log("\n Starting the miner......");
SPcoin.minePendingTransactions(myWalleteAddress);

console.log("\n Balance of sp is ",SPcoin.getBalanaceAddress(myWalleteAddress));

/* const Tx2  = new Transaction(myWalleteAddress, 'public key goes here', 10);
Tx2.signTransaction(myKey);
SPcoin.addTransaction(Tx2);

console.log("\n Starting the miner......");
SPcoin.minePendingTransactions(myWalleteAddress);

console.log("\n Balance of sp is ",SPcoin.getBalanaceAddress(myWalleteAddress));
 */

