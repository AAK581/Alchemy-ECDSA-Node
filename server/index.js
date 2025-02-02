const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require('./node_modules/ethereum-cryptography/secp256k1');
const {toHex} = require('ethereum-cryptography/utils');
const {keccak256} = require("ethereum-cryptography/keccak")
//import App from "../client/src/App";

//const toHash = require('../Functions/toHash');
//import {wallet} from '../client/src/Wallet';

app.use(cors());
app.use(express.json());
let isVerified = false;
const balances = {
  "b9929b97094bd27bff0b0a7c487f96ab255adeb8": 100, //beb48b84f0d5876a231f4a39d670891bd5ccd0ef9d921db276ea191187b6566c
  "9a7839e830ffbcef723de201fe26e40293fa9a70": 50,  //b781b6556ee13a81270698575f78862c53553d1c8af732e97567230c79088329
  "cd1d93e94f2bbe2bf3a7162db17c1dcf1eb9baf3": 75,  //461e07eefe4d3928d3085ed26833ea190bf88faf52c223f35151f5680d3289e1
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO : get a signature from the client side application
  //recover the public address from the signature
  
  const { sender, recipient, amount, signature, msgHash, privateKey} = req.body;
  //logging those parameters
  console.log("Request Body:");
  console.log(`Sender : ${sender}`); //sender is the public key, alright?
  console.log(`Recipient : ${recipient}`);
  console.log(`Amount : ${amount}`);
  console.log(`Signature : ${signature}`);
  console.log(`msgHash : ${msgHash}`);
  //turn signature back from json
  const recoveredSignature = JSON.parse(signature);
  console.log("Type of signature : ", typeof(signature));
  console.log("Type of msgHash : ", typeof(msgHash));
  console.log("Type of sender : ", typeof(sender));
  
  recoveredSignature.r = BigInt(recoveredSignature.r);
  recoveredSignature.s = BigInt(recoveredSignature.s);
  recoveredSignature.recovery = parseInt(recoveredSignature.recovery);
  const signature2 = new secp256k1.Signature(recoveredSignature.r, recoveredSignature.s, recoveredSignature.recovery);
  console.log(`msgHash : ${msgHash}`);
  console.log(`Recovered Signature.recovery : ${recoveredSignature.recovery}`);
  console.log(`Recovered Signature : ${recoveredSignature}`);
  console.log(`isVerified: ${isVerified}`);

  //Check if the transaction is valid or not
  isVerified = secp256k1.verify(signature2, msgHash, secp256k1.getPublicKey(privateKey, false));
  console.log(`isVerified: ${isVerified}`);
  console.log(`ETH address: ${toHex(keccak256((secp256k1.getPublicKey(privateKey, false)).slice(1)).slice(-20))}`);
  //If it's invalid, ohhhh boy
  if (!isVerified) //if isVerified is false
  {
    res //response object
    .status(400) //HTTP status that indicates a bad request
    .send({message : "Invalid transaction"}); //a JSON message to send to the client
    return;
  }
  else
  {
      setInitialBalance(sender);
      setInitialBalance(recipient);

      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" }); //another response object, but inline (?)
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
}
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
