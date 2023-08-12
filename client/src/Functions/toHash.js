import {utf8ToBytes} from "ethereum-cryptography/utils.js"
import {keccak256} from "ethereum-cryptography/keccak";

export default function toHash(message)
{
    const bytes = utf8ToBytes(message);
    return keccak256(bytes);
}