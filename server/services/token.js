const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
const Web3 = require('web3')
const { Token } = require("../models");
const configService = require("./config")

const createToken = async (data) => {
    let network = await configService.getConfigByKey("NETWORK")
    network = network.value
    let account = await configService.getConfigByKey("VCOIN_OWNER")
    account = account.value
    let vcoinAddress = await configService.getConfigByKey("VCOIN_ADDRESS")
    vcoinAddress = vcoinAddress.value
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(network));

    await web3.eth.net.isListening()
   
    const contractspath = path.resolve(__dirname, "../../contract/src/Lib.sol");
    const mainContractPath = path.resolve(__dirname, "../../contract/src/Main.sol");
    const sourceCodeLib = fs.readFileSync(contractspath).toString();
    const sourceCodeMain = fs.readFileSync(mainContractPath).toString();

    const input = {
        language: 'Solidity',
        sources: {
            'Lib.sol': {
                content: sourceCodeLib
            },
            'Token.sol': {
                content: data.code
            },
            'Main.sol': {
                content: sourceCodeMain
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }

    const compileCode = JSON.parse(solc.compile(JSON.stringify(input)), 1)
    const constract = compileCode.contracts["Token.sol"]["Token1"]
    const mainContractCompile = compileCode.contracts["Main.sol"]["VCoin"]
    const interface = constract.abi
    const bytecode = constract.evm.bytecode.object;
    const myContract = new web3.eth.Contract(interface);
    const mainContract = new web3.eth.Contract(mainContractCompile.abi, vcoinAddress)
    let constractAddress
    return myContract.deploy({ data: bytecode }).send({
        from: account,
        gas: 4700000
    })
        .then(function (newContractInstance) {
            constractAddress = newContractInstance.options.address
            return mainContract.methods.addToken(constractAddress)
                .send({ from: account, gas: 4700000 })
        })
        .then(res => {
            console.log('success', constractAddress)
            data.address = constractAddress
            return Token.create(data)
        })
        .then(res => {
            return res
        })
        .catch(error => {
            console.log(error)
        })
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