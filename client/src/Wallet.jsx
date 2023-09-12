import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1"
import {keccak256} from "ethereum-cryptography/keccak.js"
import {bytesToHex as toHex} from "ethereum-cryptography/utils"
import toHash from "./Functions/toHash";
import daWallet from "./Functions/daWallet";
import { useState } from "react";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey}) {
  
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = secp256k1.getPublicKey(privateKey, false);
    const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
    setAddress(address);
    const message = "Take that";
    //const msgHash = toHash(message);
    //const signature = secp256k1.sign(msgHash, privateKey, 1);
    
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Please enter your private key (heh heh)" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">
        Address: {address}
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
