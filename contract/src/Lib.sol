// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

interface ERC20Interface {
    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view  returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

interface ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes calldata data) external;
}


library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}


contract Owned {
    address public  owner;
    address public  newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}


 contract ERC20 is ERC20Interface, Owned {
    using SafeMath for uint;
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;

    
    constructor() {
        decimals = 6;
        _totalSupply = 1000000 * 10**uint(decimals);
        balances[owner] = _totalSupply;
        Transfer(address(0), owner, _totalSupply);
    }

    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256))allowed;

    function totalSupply() public view override returns (uint a) {
        return _totalSupply  - balances[address(0)];
    }

    function balanceOf(address tokenOwner) public view override returns (uint balance) {
        return balances[tokenOwner];
    }
    

    function approve(address spender, uint tokens) public override returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    

    function transferFrom(address from, address to, uint tokens) public override returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view  override returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
    
    function transfer(address to, uint tokens) public override returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        // insertUser(to);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    function approveAndCall(address spender, uint tokens, bytes memory data) public  returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        Approval(msg.sender, spender, tokens);
        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, address(this), data);
        return true;
    }
    
}


abstract contract MainToken is ERC20 {
    uint public swapFee = 500000;
    // function insertUser(address new_user) public virtual;
    function transfer(address sender, address receiver, string memory token_name, uint256 value) public virtual;
}


abstract contract Token is ERC20 {
    using SafeMath for uint;
    MainToken public creator;
    uint public transactionFee = 500000;
    uint public exchangedRatePercent = 100;   // ? token = 1 vcoin
    function setCreator() public {
        creator = MainToken(address(msg.sender));
        require(creator.owner() == owner);
    }

    modifier onlyCreator {
        require(address(msg.sender) == address(creator));
        _;
    }
        
    // gui cho dia chi ben kia bao nhieu token
    function sendToken(address received, uint256 token, string memory token_name) public {
        uint256 sendVCoin = token.mul(100).div(exchangedRatePercent);
        creator.transfer(address(msg.sender), received, token_name, sendVCoin);
        // creator.insertUser(received);
        uint fee = creator.swapFee().mul(exchangedRatePercent).div(100);
        balances[msg.sender] = balances[msg.sender].sub(token).sub(fee);
        balances[received] = balances[received].add(token);
    }
    
    function receiveToken(address sender, address received, uint256 token) public onlyCreator {
        balances[received] = balances[received].sub(token);
        balances[sender] = balances[sender].add(token);
    }
}

