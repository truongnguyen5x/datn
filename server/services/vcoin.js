const { VCoin, SmartContract, Network, Account, File, Token, Config } = require('../models')
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const configService = require("./config")
const ApiError = require("../middlewares/error")
const { Op } = require('sequelize')
const Web3 = require('web3')
const { getWeb3Instance, compileSourceCode } = require("../utils/network_util");
const { await } = require('signale')



const getListVCoin = async () => {
    const mainnet = VCoin.findOne({
        where: { network_id: 1 },
        order: [["createdAt", 'DESC']]
    })
    const ropten = VCoin.findOne({
        where: { network_id: 3 },
        order: [["createdAt", 'DESC']]
    })
    const morden = VCoin.findOne({
        where: { network_id: 2 },
        order: [["createdAt", 'DESC']]
    })
    const local = VCoin.findOne({
        where: {
            network_id: {
                [Op.notIn]: [1, 2, 3]
            }
        },
        order: [["createdAt", 'DESC']]
    })
    const pr = await Promise.all([mainnet, morden, ropten, local])
    return pr
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

const createVCoin = async (data, user_id) => {
    const { abi, network_id, account, address } = data
    return VCoin.create({ abi: JSON.stringify(abi), network_id, account, address })
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
const testDeploy = async (data, userId) => {
    const private_key = await configService.getConfigByKey("KEY_ADMIN")
    const network = await networkService.getNetWorkById(1)
    const web3 = await getWeb3Instance({ provider: network.path })
    const { address } = web3.eth.accounts.privateKeyToAccount(private_key.value);
    await web3.eth.accounts.wallet.add(private_key.value);
    const myContract = new web3.eth.Contract(data.abi)
    let symbol, newContractInstance, existToken, totalSupply
    return myContract.deploy({
        data: data.bytecode,
        arguments: data.constructor
    }).send({
        from: address,
        gas: 5000000
    })
        .then(async (res) => {
            newContractInstance = res
            return 'success'
        })
}



module.exports = {
    getListVCoin,
    getVCoinById,
    createVCoin,
    updateVCoin,
    deleteVCoin,
    testDeploy
}