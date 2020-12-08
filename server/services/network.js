const { Network } = require('../models')
const userService = require("./user")
const ApiError = require("../middlewares/error")
const _ = require('lodash')
const Web3 = require('web3')

const getListNetwork = async () => {
    return Network.findAll()
}

module.exports = {
    getListNetwork
}