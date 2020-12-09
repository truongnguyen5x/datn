const path = require("path");
const { VCoin, SmartContract, Network, Account, File, Token } = require('../models')
const fs = require("fs-extra");
const Web3 = require('web3')
const configService = require("./config")
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const solc = require("solc");
const { getWeb3Instance, getListAccount } = require("../utils/network_util")

const createToken = async (data, user_id, transaction) => {
    const { source, contract, network, account, symbol } = data
    const accSend = await accountService.getAccountById(account)
    const userSend = await userService.getUserById(user_id)
    if (accSend.user_id != user_id) {
        console.log('khong trung user id')
        throw new ApiError("ERROR")
    }
    const sourceSend = source.map(i => {
        return {
            path: i.name,
            code: i.code
        }
    })
    console.log(sourceSend)
    const createdSources = await fileService.bulkCreate(sourceSend)
    const networkSend = await networkService.getNetWorkById(network)
    const web3 = await getWeb3Instance({ provider: networkSend.path })
    console.log(accSend.key)
    await web3.eth.accounts.wallet.add(accSend.key);
    await getListAccount(web3)

    const input = {
        language: 'Solidity',
        sources: {

        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }
    source.forEach(i => {
        input.sources[i.name] = {
            content: i.code
        }
    });
    var output = JSON.parse(
        solc.compile(JSON.stringify(input))
    );
    const constractCompile = output.contracts["Token.sol"][contract]
    const interface = constractCompile.abi
    const myContract = new web3.eth.Contract(interface)
    const bytecode = constractCompile.evm.bytecode.object;

    const newSmartContract = await SmartContract.create({ deploy_status: 0 })
    await newSmartContract.setNetwork(networkSend)
    await newSmartContract.setOwner(accSend)
    await newSmartContract.setFiles(createdSources)
    let tokenCreated = await Token.findOne({
        where: {symbol}
    })
    if (!tokenCreated) {
        tokenCreated = await Token.create({symbol})
    }
    tokenCreated.addSmartContract(newSmartContract)
  

    myContract.deploy({
        data: bytecode,
        arguments: [1000000]
    }).send({
        from: accSend.address,
        gas: 3000000
    })
        .on('error', function (error) {
            console.log('error', error)
        })
        .on('transactionHash', async (transactionHash) => {
            newSmartContract.update({ deploy_status: 1 })
            console.log('transactionHash', transactionHash)
        })
        .on('receipt', async (receipt) => {
            newSmartContract.update({ deploy_status: 2, address: receipt.contractAddress })
            console.log('receipt', receipt.contractAddress) // contains the new contract address
        })
        .on('confirmation', async (confirmationNumber, receipt) => {
            newSmartContract.update({ deploy_status: 4 })
            console.log('confirm', confirmationNumber, receipt)
        })
        .then(async (newContractInstance) => {
            newSmartContract.update({ deploy_status: 3 })
            console.log('then', newContractInstance.options.address) // instance with the new contract address
        });

    return tokenCreated
}


const getListToken = async () => {
    return Token.findAll({
        where: {
            del: false
        }
    })
}

const getTokenById = async (id) => {
    return Token.findOne({
        where: {
            id,
            del: false
        }
    })
}
const getTokenBySymbol = async (symbol) => {
    return Token.findOne({
        where: {
            symbol,
            del: false
        }
    })
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
            .catch(error => {
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
            return Token.update({ del: true }, { where: { id } })
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
    getTokenContract,
    getTokenBySymbol
}