const { Account } = require('../models')
const userService = require("./user")
const ApiError = require("../middlewares/error")
const _ = require('lodash')
const Web3 = require('web3')

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
    let account = await Account.findOne({ where: { key } })
    if (account) {
        throw new ApiError("ERROR")
    }
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

module.exports = {
    getListAccount,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount
}