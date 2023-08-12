import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";

class daWallet {
    constructor (publicKey, signature, msgHash)
    {
        this.publicKey = publicKey;
        this.signature = signature;
        this.msgHash = msgHash;
    }
    isValid (publicKey2)
    {
        if (secp256k1.verify(this.signature, this.msgHash, publicKey2))
        {
            return true;
        }
        return false;
    }
}

export default daWallet;