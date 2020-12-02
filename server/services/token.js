const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
const Web3 = require('web3')
const { Token } = require("../models");
const configService = require("./config")

const createToken = async (data) => {

    const contractspath = path.resolve(__dirname, "../../contract/src/Lib.sol");
    const sourceCodeLib = fs.readFileSync(contractspath).toString();

    const input = {
        language: 'Solidity',
        sources: {
            'Lib.sol': {
                content: sourceCodeLib
            },
            'Token.sol': {
                content: data.code
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

    const interface = constract.abi
    const bytecode = constract.evm.bytecode.object;
    const web3 = await getProvider()
    const myContract = new web3.eth.Contract(interface);
    const mainContract = await getMainConstract()
    const account = await getMainAccount()
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
            data.address = constractAddress
            return Token.create(data)
        })
        .then(res => {
            return res
        })
}


const getListToken = async () => {
    return Token.findAll({})
}

const getTokenById = async (id) => {
    return Token.findOne({ where: { id } })
}

const updateToken = async (data, oldData) => {
    const { transaction_fee, exchange_rate } = data
    if (transaction_fee != oldData.transaction_fee || exchange_rate != oldData.exchange_rate) {
        const account = await getMainAccount()
        const tokenContract = await getTokenContract(oldData.address)
        return tokenContract.methods.setFee(transaction_fee, exchange_rate)
            .send({ from: account, gas: 4700000 })
            .then(res => {
                return Token.update(data, { where: { id: data.id } })
            })
            .catch(error=>{
                return error
            })

    } else {
        return Token.update(data, { where: { id: data.id } })
    }
}

const deleteToken = async (data) => {
    const { symbol, id } = data
    const mainContract = await getMainConstract()
    const account = await getMainAccount()
    return mainContract.methods.removeToken(symbol)
        .send({ from: account, gas: 4700000 })
        .then(res => {
            console.log('Delete token success')
            return Token.destroy({ where: { id } })
        })
}

const getProvider = async () => {
    let network = await configService.getConfigByKey("NETWORK")
    network = network.value
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(network));
    await web3.eth.net.isListening()
    return web3
}

const getMainConstract = async () => {
    let vcoinAddress = await configService.getConfigByKey("VCOIN_ADDRESS")
    vcoinAddress = vcoinAddress.value
    const web3 = await getProvider()
    const mainContractPath = path.resolve(__dirname, "../../contract/build/VCoin.json");
    const sourceCodeMain = fs.readFileSync(mainContractPath).toString();
    const codeCompile = JSON.parse(sourceCodeMain)
    const mainContract = new web3.eth.Contract(codeCompile.abi, vcoinAddress)
    return mainContract
}

const getTokenContract = async (contractAddress) => {
    const web3 = await getProvider()
    const contractPath = path.resolve(__dirname, "../../contract/build/Token.json");
    const sourceCode = fs.readFileSync(contractPath).toString();
    const codeCompile = JSON.parse(sourceCode)
    const contractJSON = new web3.eth.Contract(codeCompile.abi, contractAddress)
    return contractJSON
}

const getMainAccount = async () => {
    let account = await configService.getConfigByKey("VCOIN_OWNER")
    return account.value
}

module.exports = {
    createToken,
    getListToken,
    getTokenById,
    updateToken,
    deleteToken,
    getProvider,
    getMainConstract,
    getMainAccount,
    getTokenContract
}