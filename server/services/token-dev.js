const { SmartContract, Network, Account, File, Token, User, Request } = require('../models')
const configService = require("./config")
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const { Op } = require("sequelize");
const { getWeb3Instance, compileSourceCode } = require("../utils/network_util");
const VCoin = require("../models/vcoin");

const ApiError = require('../middlewares/error')

const createToken = async (data, user_id) => {
    const { source, abi, network_id, account, address, token_id, symbol, exchangeRate } = data

    const createdSources = await fileService.bulkCreate(source)

    const newSmartContract = await SmartContract.create({
        abi: JSON.stringify(abi),
        account,
        address,
        network_id
    })
    await newSmartContract.setFiles(createdSources)
    let token
    if (!token_id) {
        token = await Token.create({ symbol, user_id, exchange_rate: exchangeRate })
    } else {
        token = await Token.findOne({ where: { id: token_id } })
    }
    await token.addSmartContract(newSmartContract);
    return 'success'
}


const testDeploy = async (data, userId) => {
    const private_key = await configService.getConfigByKey("KEY_ADMIN")
    const network = await networkService.getNetWorkById(5)
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
            return newContractInstance.methods.totalSupply().call({ from: address })
        })
        .then(res => {
            totalSupply = res
            return newContractInstance.methods.symbol().call({ from: address })
        })
        .then(async res => {
            symbol = res
            existToken = await Token.findOne({
                where: { symbol }
            })
            if (existToken) {
                // TODO check
                const tokenOwner = await existToken.getOwner()
                if (tokenOwner.id != userId) {
                    throw new ApiError("Symbol has taken")
                }
            }
            return newContractInstance.methods.exchangedRatePercent().call({ from: address })
        })
        .then((res) => {
            return {
                symbol,
                exchangedRatePercent: res,
                existToken,
                totalSupply
            }
        })
}


const getListToken = async (user_id, type) => {
    const user = await userService.getUserById(user_id)
    switch (type) {
        case "all":
            return user.getTokens()
        case "requested":
            return Token.findAll({
                where: {
                    user_id
                },
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
                where: {
                    user_id
                },
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
    switch (type) {
        case "requested":
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
                            del: 0
                        },
                        required: true
                    }],

                    required: true
                }],
                order: [[{ model: SmartContract, as: "smartContracts" }, 'createdAt', 'DESC']]
            })
        default:
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
                            del: 0
                        },
                        required: false
                    }]
                }],
                order: [[{ model: SmartContract, as: "smartContracts" }, 'createdAt', 'DESC']]
            })

    }

}


const getTokenBySymbol = async (symbol) => {
    return Token.findOne({
        where: {
            symbol
        }
    })
}

const validateSource = async (data) => {
    const output = await compileSourceCode(data)
    const responses = []
    Object.keys(output.contracts).forEach(i => {
        Object.keys(output.contracts[i]).forEach(j => {
            let constructor = output.contracts[i][j].abi.find(k => k.type == 'constructor')
            if (constructor) {
                constructor = constructor.inputs
            }
            responses.push({
                file: i,
                contract: j,
                inputs: constructor,
                bytecode: output.contracts[i][j].evm.bytecode.object,
                abi: output.contracts[i][j].abi
            })
        })
    })

    return responses
}

const createRequest = async (data) => {
    const smartContract = await SmartContract.findOne({
        where: { id: data.id }
    })
    const token = await smartContract.getToken()
    const existRequest = await Request.findAll({
        include: {
            model: SmartContract,
            as: "smartContract",
            where: {
                token_id: token.id,
                network_id: smartContract.network_id
            }
        }
    })
    existRequest.forEach(async i => {
        await i.update({ del: 1 })
    })
    const requestNew = await Request.create({})
    await requestNew.setSmartContract(smartContract)

    return 'new '
}

const cancelRequest = async (data) => {
    const requestNew = await Request.findOne({
        where: {
            smart_contract_id: data.id
        }
    })
    await requestNew.update({ del: 1 })
    return 'success'
}




module.exports = {
    createToken,
    getTokenById,
    getTokenBySymbol,
    validateSource,
    getListToken,
    createRequest,
    cancelRequest,
    testDeploy
}