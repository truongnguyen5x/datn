// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import './lib.sol';


contract VCoin is MainToken {    
    address[] public userIndex;
    mapping(address => uint) tableIndex;
    using SafeMath for uint;
    mapping(string => TokenStruct) public tokenStruct;
    string[] public tokenIndex;
    
    struct TokenStruct {
        Token tokenAddress;
        uint index;
    }
    
    constructor() {
        userIndex.push(owner);
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
    
    function transfer(address to, uint tokens) public override returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        insertUser(to);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    
    function isUser(address userAddress) public view returns(bool isIndeed) {
        return (userIndex[tableIndex[userAddress]] == userAddress);
    }
    
    function insertUser(address new_user) public override {
        if (!isUser(new_user)) {
            userIndex.push(new_user);
            tableIndex[new_user] = userIndex.length-1;
        }
    }

    struct UserResult {
        string tokenName;
        uint256 balance;
    }
    
    function getUser(address user_addr) public view returns(UserResult[] memory) {
        UserResult[] memory result = new UserResult[](tokenIndex.length); 
        for (uint i =0; i< tokenIndex.length; i++) {
            result[i].tokenName = tokenIndex[i];
            Token a = tokenStruct[result[i].tokenName].tokenAddress;
            result[i].balance = a.balanceOf(user_addr);
        }
        return result;
    }
}