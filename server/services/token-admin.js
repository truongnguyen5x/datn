const { SmartContract, Network, Account, File, Token, User, Request } = require('../models')
const configService = require("./config")
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const { Op } = require("sequelize");
const { getWeb3Instance } = require("../utils/network_util");
const VCoin = require("../models/vcoin");


const getListToken = async (type) => {
    switch (type) {
        case "pending":
            return Token.findAll({
                include: [{
                    model: User,
                    as: "owner"
                }, {
                    model: SmartContract,
                    as: 'smartContracts',
                    include: [{
                        model: Request,
                        as: "request",
                        where: {
                            del: 0,
                            accepted: 0
                        },
                        required: true
                    }, {
                        model: Network,
                        as: 'network'
                    }],
                    required: true
                }]
            })

        case "in-vchain":
            return Token.findAll({
                include: [{
                    model: User,
                    as: "owner"
                }, {
                    model: SmartContract,
                    as: 'smartContracts',
                    include: [{
                        model: Request,
                        as: "request",
                        where: {
                            del: 0,
                            accepted: 1
                        },
                        required: true
                    }, {
                        model: Network,
                        as: 'network'
                    }],
                    required: true
                }]
            })
        default:
            return []
    }
}


const getTokenById = async (id, type) => {
    if (type == "pending") {
        return Token.findOne({
            where: {
                id
            },
            include: [{
                model: User,
                as: "owner"
            }, {
                model: SmartContract,
                as: 'smartContracts',
                include: [{
                    model: File,
                    as: 'files'
                }, {
                    model: Request,
                    as: "request",
                    where: {
                        del: 0,
                        accepted: 0
                    },
                    required: true
                }, {
                    model: Network,
                    as: 'network'
                }],
                required: true
            }],
            order: [[{ model: SmartContract, as: "smartContracts" }, 'createdAt', 'DESC']]
        })
    } else if (type == 'in-vchain') {
        return Token.findOne({
            where: {
                id
            },
            include: [{
                model: User,
                as: "owner"
            }, {
                model: SmartContract,
                as: 'smartContracts',
                include: [{
                    model: File,
                    as: 'files'
                }, {
                    model: Request,
                    as: "request",
                    where: {
                        del: 0,
                        accepted: 1
                    }
                }, {
                    model: Network,
                    as: 'network'
                }]
            }],
            order: [[{ model: SmartContract, as: "smartContracts" }, 'createdAt', 'DESC']]
        })
    }
}



const deleteToken = async (id) => {
    const requestNew = await Request.findOne({
        where: {
            del: 0,
            smart_contract_id: id
        }
    })
    await requestNew.update({ accepted: 0, del: 1 })
    return 'success'
}


const acceptRequest = async (data) => {
    const requestNew = await Request.findOne({
        where: {
            del: 0,
            smart_contract_id: data.id
        }
    })

    await requestNew.update({ accepted: 1 })
    return 'success'
}

const denyRequest = async (data) => {
    const requestNew = await Request.findOne({
        where: {
            smart_contract_id: data.id
        }
    })
    await requestNew.update({ del: 1 })
    return 'success'
}



module.exports = {
    getListToken,
    getTokenById,
    deleteToken,
    acceptRequest,
    denyRequest
}