import {secp256k1} from "ethereum-cryptography/secp256k1";
// import { keccak256 } from "ethereum-cryptography/keccak";
// import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

signMsg = (msg, privateKey) => {
    return secp256k1.sign(msg, privateKey)
}
export { signMsg };   