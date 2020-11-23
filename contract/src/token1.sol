// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import './lib.sol';


contract Token1 is Token {
    using SafeMath for uint;
    MainToken public creator;
    
    modifier onlyCreator {
        require(address(msg.sender) == address(creator));
        _;
    }
    constructor() {
        symbol = "TOKEN1";
        exchangedRatePercent = 100;
    }
    
    function setCreator() public override{
        creator = MainToken(address(msg.sender));
        require(creator.owner() == owner);
    }
    
    // gui cho dia chi ben kia bao nhieu token
    function sendToken(address received, uint256 token, string memory token_name) public {
        uint256 sendVCoin = token.mul(100).div(exchangedRatePercent);
        creator.transfer(address(msg.sender), received, token_name, sendVCoin);
        creator.insertUser(received);
        uint fee = creator.transactionFee().mul(exchangedRatePercent).div(100);
        balances[msg.sender] = balances[msg.sender].sub(token).sub(fee);
        balances[received] = balances[received].add(token);
    }
    
    function receiveToken(address sender, address received, uint256 token) public override onlyCreator {
        balances[received] = balances[received].sub(token);
        balances[sender] = balances[sender].add(token);
    }
    
    function transfer(address to, uint tokens) public override returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        creator.insertUser(to);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
}

contract Token2 is Token1 {
    constructor() {
        symbol = "TOKEN2";
        exchangedRatePercent = 100;
    }
}
contract Token3 is Token1 {
    constructor() {
        symbol = "TOKEN3";
        exchangedRatePercent = 100;
    }
}
