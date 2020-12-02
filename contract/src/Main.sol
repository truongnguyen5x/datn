// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import './Lib.sol';


contract VCoin is MainToken {    
    // address[] public userIndex;
    mapping(address => uint) tableIndex;
    using SafeMath for uint;
    mapping(string => TokenStruct) public tokenStruct;
    string[] public tokenIndex;
    
    struct TokenStruct {
        Token tokenAddress;
        uint index;
    }
    
    constructor() {
        // userIndex.push(owner);
        tableIndex[owner] = 0;
        symbol = "VCOIN";
    }
    
    function addToken(address token_addr) external onlyOwner{
        Token added = Token(token_addr);
        added.setCreator();
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
    
    function transfer(address sender, address received, string memory token_name, uint256 vcoin) public override{
        Token token = tokenStruct[token_name].tokenAddress;
        uint256 sendAmount = vcoin.mul(token.exchangedRatePercent()).div(100);
        token.receiveToken(sender, received, sendAmount);
    }

}