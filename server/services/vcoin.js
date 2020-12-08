const { VCoin, Account } = require('../models')
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const ApiError = require("../middlewares/error")
const { sequelize } = require("../configs")
const { getWeb3Instance, getListAccount } = require("../utils/network_util")

const getListVCoin = async () => {
    return VCoin.findAll({})
}

const getVCoinById = async (id) => {
    return VCoin.findOne({ where: { id } })
}

const createVCoin = async (data, user_id, transaction) => {
    const { source, contract, network, account } = data
    const accSend = await accountService.getAccountById(account)
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
    const createdSources = await fileService.bulkCreate(sourceSend)
    const networkSend = await networkService.getNetWorkById(network)
    const web3 = await getWeb3Instance({provider: networkSend.path})
    console.log(accSend.key)
    await web3.eth.accounts.wallet.add(accSend.key);
    await getListAccount(web3)
    // console.log(web3.eth.accounts.wallet)
    return '1'
}

const updateVCoin = async (data) => {
    return VCoin.update(data, { where: { id: data.id } })
}

const deleteVCoin = async (id) => {
    return VCoin.destroy({ where: { id } })
}

module.exports = {
    getListVCoin,
    getVCoinById,
    createVCoin,
    updateVCoin,
    deleteVCoin
}