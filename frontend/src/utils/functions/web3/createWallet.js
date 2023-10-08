import getEapk from '../../api/get/getEapk';
import getCookie from '../getCookie';
import decryptAES from './decryptAES';
import { web3 } from '../../constants/web3.js';

export default async function createWallet() {
	const eapk = await getEapk();
	const cookie = getCookie('usrk');

	const seed = await decryptAES(eapk, cookie);
	const privateKey = web3.utils.sha3(seed.toString());
	const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);

	const tokenAddress = wallet.address;
	localStorage.setItem('tokenAddress', tokenAddress);
	const { privateKey: prk } = wallet;

//	console.log('createWallet=> ' + prk,tokenAddress);

	return { prk, tokenAddress };
}
