const { secp256k1 } = require ("../node_modules/ethereum-cryptography/secp256k1.js");
const { keccak256 } = require ("../node_modules/ethereum-cryptography/keccak.js");
const {toHex} = require('../node_modules/ethereum-cryptography/utils');

const privateKey = secp256k1.utils.randomPrivateKey();
console.log("Private Key : ", toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey, isCompressed = false);
console.log("Public key : ", toHex(publicKey));
console.log("Ether address is", toHex(keccak256(publicKey.slice(1)).slice(-20)));