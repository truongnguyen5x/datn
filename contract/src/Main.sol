// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import './Lib.sol';


contract VCoin is MainToken {    
    using SafeMath for uint;
    mapping(string => TokenStruct) public tokenStruct;
    string[] public tokenIndex;
    
    struct TokenStruct {
        Token tokenAddress;
        uint index;
    }
    
    constructor() {
        symbol = "VCOIN";
    }
    
    function addToken(address token_addr) external onlyOwner{
        Token added = Token(token_addr);
        added.setCreator();
        require(!this.isToken(added.symbol()));
        tokenStruct[added.symbol()].tokenAddress = added;
        tokenIndex.push(added.symbol());
        tokenStruct[added.symbol()].index = tokenIndex.length-1;
    }
    
    function removeToken(string memory token_name) external {
        uint rowToDelete = tokenStruct[token_name].index;
        string memory keyToMove = tokenIndex[tokenIndex.length-1];
        tokenIndex[rowToDelete] = keyToMove;
        tokenStruct[keyToMove].index = rowToDelete; 
        tokenIndex.pop();
    }
    
    function isToken(string memory token_name) public view returns (bool) {
        if(tokenIndex.length == 0) return false;
        return keccak256(bytes(token_name)) == keccak256(bytes(tokenIndex[tokenStruct[token_name].index]));
    }
    
    function transfer(address sender, address received, string memory token_name, uint256 vcoin) public override{
        Token token = tokenStruct[token_name].tokenAddress;
        uint256 sendAmount = vcoin.mul(token.exchangedRatePercent()).div(100);
        token.receiveToken(sender, received, sendAmount);
    }
    
    function deleteAllToken() public {
        delete tokenIndex;
    }
}