// SPDX-License-Identifier: MIT
pragma solidity >0.7.0 <=0.9.0;


/*
wallet1:
{
  privateKey: '0x5856763a9a665c3d35d9cb1fd175b9534ce65970bc31da4035fbbfb754cc1214',
  address: '0x3421DeE886aaa5993CCF58538982C60Bcf4051bf'
}

wallet2:
{
  privateKey: '0x75f0b4ff5c0756015032a27eb079c1758d30004ae68cb210661d823a4a939f0b',
  address: '0x31Dd1bD16B1D891bF9A3a60f1d319551D4Efccd8'
}

*/



import "@openzeppelin/contracts@4.8.3/access/Ownable.sol";

interface IERC20 {
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
}


contract Exchange is Ownable {

    IERC20 token0;
    IERC20 token1;
    address treasury;
    uint256 fee;

    struct Sinfo {
        uint256 amount; 
        address addr; 
        bytes signature;
    }

    constructor(address _addr0, address _addr1, address _treasury) {
        token0 = IERC20(_addr0);
        token1 = IERC20(_addr1);
        treasury=_treasury;
        fee=10;
    }

    function changeTreasury(address _treasury) external onlyOwner {
        treasury=_treasury;
    }


    //security problem: anyone could send a previous valiue already signed by the real person although that person had canceled the transaction. This is being mitigated by alowing only the owner to execute this function and the owner will be a relayer executing it but we can't trust that 100% for production
    // It is not gas improved.
    //Contract has permision to move both tokens.
    // No partial order accepted. once executed a partial, the rest is deleted
    function change(uint256 _price, Sinfo memory _bid, Sinfo memory _ask) external  checkTransfer(_price,_bid) checkTransfer(_price,_ask) onlyOwner {
        uint256 _fee=fee;
        uint256 _tokenAmount;
        uint256 _dolarAmount;
        uint256 dolarFee;
        uint256 tokenFee;
        if(_bid.amount < _ask.amount) { 
            _tokenAmount=_bid.amount;
            tokenFee=_tokenAmount*_fee/1000;
            _tokenAmount = _tokenAmount - tokenFee;

            _dolarAmount=_bid.amount*_price;
            dolarFee=_dolarAmount*_fee/1000;
            _dolarAmount = _dolarAmount - dolarFee;
        } else { 
            _tokenAmount=_ask.amount;
            _dolarAmount=_ask.amount*_price;
        }
        token0.transferFrom(_ask.addr, _bid.addr, _tokenAmount); //tokens = bid compra tokens al ask
        token1.transferFrom(_bid.addr, _ask.addr, _dolarAmount); //USDC = ask recibe dolars del Bid
        //Comisiones
        token0.transferFrom(_bid.addr, treasury, dolarFee); //USDC = tesoro recibe dolar del bid
        token1.transferFrom(_ask.addr, treasury, tokenFee); //TOKENS = Tesoro recibe tokens del ask
    }

    modifier checkTransfer (uint256 _price, Sinfo memory _bid) { //address _addr, uint _amount, uint _price,bytes memory signature) {
        require( verify(_bid.addr, _bid.amount, _price, _bid.signature)==true, "Usted no tiene permiso" );
        _;
    }



    function getMessageHash( address _from, uint _amount, uint _price) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_amount, _from, _price));
    }


    function verify(address _from, uint _amount, uint _price, bytes memory signature) internal pure returns (bool) {
        bytes32 messageHash = getMessageHash( _from, _amount, _price);
        return recoverSigner(messageHash, signature) == _from;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        (bytes32 _r, bytes32 _s, uint8 _v) = splitSignature(_signature);
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, _ethSignedMessageHash));
        address signer = ecrecover(prefixedHashMessage, _v, _r, _s);
        return signer;
    }

    

    function splitSignature( bytes memory sig ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        return(r,s,v);
    }





}