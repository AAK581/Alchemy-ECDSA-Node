import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1"
import {keccak256} from "ethereum-cryptography/keccak.js"
import {bytesToHex as toHex} from "ethereum-cryptography/utils"


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey}) {
  
  async function onChange(evt) {
    try {
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
    catch(ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Private Key</h1>
      <input placeholder="Enter Private Key" value={privateKey} onChange={onChange}></input>
      <br />
      <div className="key">Wallet Address: {address}</div>
      {/* <div className="errormsg">{invalidPK || null}</div> */}
      <br />
      <div className="balance">Balance: {balance}</div>
    </div>
  );
  }
export default Wallet;
