import fetchAPI from '../api/fetchAPI';
import {
    provider,
    web3,
    secAbi,
} from '../constants/web3';
import { ethers } from 'ethers';





const createInstance = (address, abi) => {
    return new ethers.Contract(address, abi, provider);
};



async function balanceOf(userAddress, contractAddress) {
    // console.log('secAbi = '+secAbi);
    // console.log('contractAddress = '+contractAddress);
    const sec_contract = await new web3.eth.Contract(secAbi, contractAddress);
    // console.log('userAddress = '+userAddress);
    const data = await sec_contract.methods.balanceOf(userAddress).call();
    // console.log('data = '+data.toString());
    return data.toString();
}


//getTransactionStatusByHash("0x14c5f484adfd1f07c8d0cd456e45beae75f5a23dd211547b2103e3a2b97dd46b").then(console.log);
//185 si está en pending (no mando nada al back), para todo el resto de los casos mando. 1 quiere decir success.
async function getTransactionStatusByHash(txId) {
	var transaction;
	try{
		var transaction = await web3.eth.getTransactionReceipt(txId);
		transaction = transaction.status;
	}catch(err){
		//console.log(err);
		transaction = 185;
	}
    return transaction.toString();
}

export { balanceOf, getTransactionStatusByHash };
