const { VCoin, SmartContract, Network, Account, File, Token, Config } = require('../models')
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const configService = require("./config")
const ApiError = require("../middlewares/error")

const Web3 = require('web3')
const { getWeb3Instance, getListAccount, exporSdkWorker, compileSourceCode } = require("../utils/network_util");
const { vcoinService } = require('.')


const getListVCoin = async () => {
    const web3 = new Web3()
    const config = await configService.getConfigByKey("KEY_ADMIN")
    const { address } = web3.eth.accounts.privateKeyToAccount(config.value);

    const rs = await Network.findAll({
        include: [{
            model: VCoin,
            as: "vcoins"
        }],
        order: [
            ["createdAt", 'DESC'],
            [{ model: VCoin, as: "vcoins" }, "createdAt", 'DESC']
        ]
    })
    return {
        address_account: address,
        address: rs
    }
}

const getVCoinById = async (id) => {
    return VCoin.findOne({
        where: {
            id
        },
        include: {
            model: Network,
            as: 'network'
        }
    })
}

const createVCoin = async (data, transaction) => {
    const { network } = data
    const file1 = await configService.getConfigByKey("LIB.SOL")
    const file2 = await configService.getConfigByKey("MAIN.SOL")
    const private_key = await configService.getConfigByKey("KEY_ADMIN")
    const networkSend = await networkService.getNetWorkById(network)
    const web3 = await getWeb3Instance({ provider: networkSend.path })
    const { address } = web3.eth.accounts.privateKeyToAccount(private_key.value);
    await web3.eth.accounts.wallet.add(private_key.value);
    // await getListAccount(web3)

    var output = await compileSourceCode([
        { path: "Lib.sol", code: file1.value },
        { path: "Main.sol", code: file2.value }
    ])
    const constractCompile = output.contracts["Main.sol"]["VCoin"]
    const interface = constractCompile.abi
    const myContract = new web3.eth.Contract(interface)
    const bytecode = constractCompile.evm.bytecode.object;

    const newVCoin = await VCoin.create({ abi: JSON.stringify(interface) }, { transaction })
    await newVCoin.setNetwork(networkSend, { transaction })

    // myContract.deploy({
    //     data: bytecode,
    //     arguments: [1000000, "vcoin", "vcn"]
    // }).estimateGas({ gas: 5000000 })
    // .then(gas => {
    myContract.deploy({
        data: bytecode,
        arguments: [1000000, "vcoin", "vcn"]
    })
        .send({
            from: address,
            gas: 3000000
            // gas
        })
        .on('error', function (error) {
            // console.log('error')
        })
        .on('transactionHash', async (transactionHash) => {
            // console.log('transactionHash', transactionHash)
        })
        .on('receipt', async (receipt) => {
            // console.log('receipt', receipt.contractAddress)
            newVCoin.update({ address: receipt.contractAddress })
        })
        .on('confirmation', async (confirmationNumber, receipt) => {
            // console.log('confirm', confirmationNumber, receipt)
        })
        .then(async (newContractInstance) => {
            // console.log('then', newContractInstance.options.address)
        })
    // })
    return newVCoin
}

const updateVCoin = async (data) => {
    const { network, address } = data
    const sendNetwork = await networkService.getNetWorkById(network)
    const coin = await VCoin.create({ address })
    await coin.setNetwork(sendNetwork)
    return coin
}

const deleteVCoin = async (id) => {
    return VCoin.destroy({ where: { id } })
}

const exportSDK = async (id) => {
    const vcoin = await getVCoinById(id)
    const key = await configService.getConfigByKey('KEY_ADMIN')

    return exporSdkWorker('VCOIN', vcoin.address, key.value, vcoin.network.path, JSON.parse(vcoin.abi))
}

module.exports = {
    getListVCoin,
    getVCoinById,
    createVCoin,
    updateVCoin,
    deleteVCoin,
    exportSDK
}