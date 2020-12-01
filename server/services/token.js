const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
const { Token } = require("../models");

const createToken = async (code) => {

    // Feth path of build
    const buildPath = path.resolve(__dirname, "../../contract/build");
    const contractspath = path.resolve(__dirname, "../../contract/src");

    // Removes folder build and every file in it
    fs.removeSync(buildPath);

    // Fetch all Contract files in Contracts folder
    const fileNames = fs.readdirSync(contractspath);

    var input1 = {
        language: 'Solidity',
        sources: {
            'lib.sol': {
                content: `// SPDX-License-Identifier: GPL-3.0
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
                    uint public transactionFee = 500000;
                    // function insertUser(address new_user) public virtual;
                    function transfer(address sender, address receiver, string memory token_name, uint256 value) public virtual;
                }
                
                
                abstract contract Token is ERC20 {
                    using SafeMath for uint;
                    MainToken public creator;
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
                        uint fee = creator.transactionFee().mul(exchangedRatePercent).div(100);
                        balances[msg.sender] = balances[msg.sender].sub(token).sub(fee);
                        balances[received] = balances[received].add(token);
                    }
                    
                    function receiveToken(address sender, address received, uint256 token) public onlyCreator {
                        balances[received] = balances[received].sub(token);
                        balances[sender] = balances[sender].add(token);
                    }
                } `
            },
            'token.sol': {
                content: code
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }

    // const input = fileNames.reduce(
    //     (input, fileName) => {
    //         const filePath = path.resolve(__dirname, "../../contract/src", fileName);
    //         const source = fs.readFileSync(filePath, "utf8");
    //         return { sources: { ...input.sources, [fileName]: {content: source}  } };
    //     },
    //     { sources: {} }
    // );

    // const input3 = {
    //     language: 'Solidity',
    //     settings: {
    //         outputSelection: {
    //             '*': {
    //                 '*': ['*']
    //             }
    //         }
    //     }
    // }

    
    // input3.sources = input.sources
    // const output = JSON.parse(solc.compile(JSON.stringify(input3))) ;
    // console.log(output)
    // fs.ensureDirSync(buildPath);


    // for (let contract in output) {
    //     fs.outputJsonSync(
    //         path.resolve(buildPath, contract.split(":")[1] + ".json"),
    //         output[contract]
    //     );
    // }

    var output = JSON.parse(solc.compile(JSON.stringify(input1)));
    if (output.errors) {
        throw new Error(output.errors[0].formattedMessage)
    }

}

const getListToken = async () => {
    return Token.findAll({})
}

const getTokenById = async (id) => {
    return Token.findOne({ where: { id } })
}

const updateToken = async (data) => {
    return Token.update(data, { where: { id: data.id } })
}

const deleteToken = async (id) => {
    return Token.destroy({ where: { id } })
}

module.exports = {
    createToken,
    getListToken,
    getTokenById,
    updateToken,
    deleteToken
}