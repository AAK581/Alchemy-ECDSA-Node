import { useState } from "react";
import server from "./server";
import App from "./App";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isVerified, setIsVerified] = useState("");
  //const [signature, setSignature] = useState("");
  //const msg = "Take that";
  
  
  server.post(`send`);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
  
    try {
      //hash message
      const msg = "Take that";
      const msgHash = toHex(keccak256(utf8ToBytes(msg)));
      //sign it
      let signature = secp256k1.sign(msgHash, privateKey);
      console.log(`Signature: ${signature}`);
      //turn signature to JSON so we can upload it to the server
      signature = JSON.stringify({
        ...signature,
        r: signature.r.toString(),
        s: signature.s.toString(),
      })
      console.log(`Signature JSON : ${signature}`);
      //send signature, sender address, and amount of money
      const {
        data: { balance, isVerified },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: signature,
        msg: msg,
        msgHash: msgHash
      });
      setBalance(balance);
      setIsVerified(isVerified);
      console.log(`isVerified: ${isVerified}`);
    } catch (ex) {
      isVerified = false;
      setIsVerified(false);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
