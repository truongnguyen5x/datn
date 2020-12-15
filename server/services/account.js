const { Account } = require('../models')
const userService = require("./user")
const networkService = require("./network")
const ApiError = require("../middlewares/error")
const _ = require('lodash')
const Web3 = require('web3')
const { getWeb3Instance, getListAccount: web3GetAcc} = require("../utils/network_util")

const getListAccount = async (userId) => {
    const user = await userService.getUserById(userId)
    return user.getWallets()
}

const getAccountById = async (id) => {
    return Account.findOne({ where: { id } })
}

const createAccount = async (data, userId) => {
    const user = await userService.getUserById(userId)
    const { key, name } = data
    const web3 = new Web3()
    const { address } = web3.eth.accounts.privateKeyToAccount(key);
    const dataCreated = { address, key, name }
    account = await Account.create(dataCreated)
    await user.addWallet(account)
    return user
}

const updateAccount = async (data) => {
    return Account.update(data, { where: { id: data.id } })
}

const deleteAccount = async (id) => {
    return Account.destroy({ where: { id } })
}

const getListAccountBalance = async (user_id, network_id) => {
    const network = await networkService.getNetWorkById(network_id)
    const user = await userService.getUserById(user_id)
    const accounts = await user.getWallets()
    const web3 = await getWeb3Instance({ provider: network.path })

    await web3GetAcc(web3)
    
    const pm = accounts.map(async i => {
        let balance = await web3.eth.getBalance(i.address)
        balance = web3.utils.fromWei(balance)
        i.setDataValue("balance", balance)
        return i
    })
    const rs = await Promise.all(pm)
    return rs
}

module.exports = {
    getListAccount,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    getListAccountBalance
}