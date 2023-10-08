import CryptoJS from 'crypto-js';

export default async function decryptAES(eapk, cookie) {
    const decrypted = CryptoJS.AES.decrypt(eapk, cookie);
    return decrypted;
}
