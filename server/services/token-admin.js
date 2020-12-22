const { SmartContract, Network, Account, File, Token, User, Request } = require('../models')
const configService = require("./config")
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const { Op } = require("sequelize");
const { getWeb3Instance, getListAccount, exporSdkWorker, compileSourceCode } = require("../utils/network_util");
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
                    include: {
                        model: Request,
                        as: "request",
                        where: {
                            del: 0,
                            accepted: 0
                        },
                        required: true
                    },
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
                    include: {
                        model: Request,
                        as: "request",
                        where: {
                            del: 0,
                            accepted: 1
                        },
                        required: true
                    },
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
                    model: Network,
                    as: 'network'
                }, {
                    model: File,
                    as: 'files'
                }, {
                    model: Account,
                    as: 'account'
                }, {
                    model: Request,
                    as: "request",
                    where: {
                        del: 0,
                        accepted: 0
                    }
                }]
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
                    model: Network,
                    as: 'network'
                }, {
                    model: File,
                    as: 'files'
                }, {
                    model: Account,
                    as: 'account'
                }, {
                    model: Request,
                    as: "request",
                    where: {
                        del: 0,
                        accepted: 1
                    }
                }]
            }],
            order: [[{ model: SmartContract, as: "smartContracts" }, 'createdAt', 'DESC']]
        })
    }
}



const deleteToken = async (id, transaction) => {
    const smartContract = await SmartContract.findOne({ where: { id } })
    const token = await smartContract.getToken()
    const requestNew = await Request.findOne({
        where: {
            del: 0,
            smart_contract_id: id
        }
    })
    const vcoin = await VCoin.findOne({
        include: {
            model: Network,
            as: "network",
            where: {
                id: smartContract.network_id
            }
        },
        order: [
            ["createdAt", 'DESC']
        ]
    })

    const privateKey = await configService.getConfigByKey("KEY_ADMIN")
    const web3 = await getWeb3Instance({ provider: vcoin.network.path })
    const { address } = web3.eth.accounts.privateKeyToAccount(privateKey.value);
    const interface = JSON.parse(vcoin.abi)

    const myContract = new web3.eth.Contract(interface, vcoin.address)
    await web3.eth.accounts.wallet.add(privateKey.value);
    // myContract.methods.addToken(smartContract.address)
    //     .estimateGas({ gas: 5000000 })
    //     .then(gas => {
    myContract.methods.removeToken(token.symbol)
        .send({
            from: address,
            gas: 5000000
            // gas
        })
        .on('transactionHash', (hash) => {
            console.log('transactionHash', hash)
        })
        .on('receipt', (receipt) => {
            console.log('receipt', receipt)
        })
        .on('confirmation', (confirmationNumber, receipt) => {
            console.log('confirmation', confirmationNumber, receipt)
        })
        .on('error', async err => {
            console.log('error')
        });
    // })
    await requestNew.update({ accepted: 0, del: 1 }, { transaction })
    return 'success'

}


const acceptRequest = async (data, transaction) => {
    const smartContract = await SmartContract.findOne({ where: { id: data.id } })
    const requestNew = await Request.findOne({
        where: {
            del: 0,
            smart_contract_id: data.id
        }
    })

    const vcoin = await VCoin.findOne({
        include: {
            model: Network,
            as: "network",
            where: {
                id: smartContract.network_id
            }
        },
        order: [
            ["createdAt", 'DESC']
        ]
    })

    const privateKey = await configService.getConfigByKey("KEY_ADMIN")
    const web3 = await getWeb3Instance({ provider: vcoin.network.path })
    const { address } = web3.eth.accounts.privateKeyToAccount(privateKey.value);
    const interface = JSON.parse(vcoin.abi)

    const myContract = new web3.eth.Contract(interface, vcoin.address)
    await web3.eth.accounts.wallet.add(privateKey.value);
    // myContract.methods.addToken(smartContract.address)
    //     .estimateGas({ gas: 5000000 })
    //     .then(gas => {
    myContract.methods.addToken(smartContract.address)
        .send({
            from: address,
            gas: 5000000
            // gas
        })
        .on('transactionHash', (hash) => {
            console.log('transactionHash', hash)
        })
        .on('receipt', (receipt) => {
            console.log('receipt', receipt)
        })
        .on('confirmation', (confirmationNumber, receipt) => {
            console.log('confirmation', confirmationNumber, receipt)
        })
        .on('error', async err => {
            console.log('error')
        });
    // })

    await requestNew.update({ accepted: 1 }, { transaction })
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