const { SmartContract, Network, Account, File, Token, User, Request } = require('../models')
const configService = require("./config")
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const { Op } = require("sequelize");
const { getWeb3Instance, compileSourceCode } = require("../utils/network_util");
const VCoin = require("../models/vcoin");
const Web3 = require('web3')

const ApiError = require('../middlewares/error')




const createToken = async (data, user_id) => {
    const { source, abi, network_id, account, address, chain_id, bytecode,
        tokenSymbol, tokenName, initialSupply, description, constructorData } = data
    let token = await Token.findOne({
        where: { symbol: tokenSymbol }
    })
    const user = await userService.getUserById(user_id)
    if (token) {
        // TODO check
        const tokenOwner = await token.getOwner()
        if (tokenOwner.id != user_id) {
            throw new ApiError("Symbol has taken")
        }
    }
    let network
    if (address) {
        network = await Network.findOne({ where: { chain_id } })
    } else {
        network = await networkService.getNetWorkById(network_id)
    }
    const createdSources = await fileService.bulkCreate(source)

    // create smart contract
    const newSmartContract = await SmartContract.create({
        abi: JSON.stringify(abi),
        address,
        account,
        bytecode,
        constructor_data: constructorData ? JSON.stringify(constructorData) : null
    })
    newSmartContract.setFiles(createdSources)
    newSmartContract.setNetwork(network)
    if (token) {
        await token.addSmartContract(newSmartContract)
        await token.update({ symbol: tokenSymbol, name: tokenName, initial_supply: initialSupply, description })
    } else {
        token = await Token.create({
            symbol: tokenSymbol,
            name: tokenName,
            initial_supply: initialSupply,
            description,
            exchange_rate: 100
        })
        await token.addSmartContract(newSmartContract)
        await token.setOwner(user)
    }
    return token
}


const testDeploy = async (data, userId) => {
    const private_key = await configService.getConfigByKey("KEY_ADMIN")
    const network = await networkService.getNetWorkById(3)
    const web3 = await getWeb3Instance({ provider: network.path })
    const { address } = web3.eth.accounts.privateKeyToAccount(private_key.value);
    await web3.eth.accounts.wallet.add(private_key.value);
    const myContract = new web3.eth.Contract(data.abi)
    let symbol, newContractInstance, existToken, totalSupply
    return myContract.deploy({
        data: data.bytecode,
        arguments: data.constructor
    })
        .estimateGas()
        .then(gas => {
            console.log('estimate gas', gas)
            return myContract.deploy({
                data: data.bytecode,
                arguments: data.constructor
            }).send({
                from: address,
                gas: gas + 1000000
            })
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
            return newContractInstance.methods.name().call({ from: address })
        })
        .then((name) => {
            return {
                symbol,
                name,
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
                where: {
                    user_id
                },
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
                    }, {
                        model: Network,
                        as: 'network'
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
                    }, {
                        model: Network,
                        as: 'network'
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
    const libSol = await configService.getConfigByKey('LIB.SOL')
    const tokenSol = await configService.getConfigByKey('TOKEN.SOL')
    const originOutput = await compileSourceCode([{
        code: libSol.value,
        path: 'Lib.sol'
    }, {
        code: tokenSol.value,
        path: 'Token.sol'
    }])
    const originAbi = originOutput.contracts['Token.sol']['Token1'].abi
    const originFunction = originAbi.filter(i => i.type == 'function')
        .map(i => i.name)
    const output = await compileSourceCode(data)
    const responses = []
    Object.keys(output.contracts).forEach(i => {
        Object.keys(output.contracts[i]).forEach(j => {
            let constructor = output.contracts[i][j].abi.find(k => k.type == 'constructor')
            if (constructor) {
                constructor = constructor.inputs
            }
            const listFunction = output.contracts[i][j].abi
                .filter(i => i.type == 'function')
                .map(i => i.name)
            const inTheList = originFunction.every(i => listFunction.includes(i))
            if (listFunction.length && inTheList) {
                responses.push({
                    file: i,
                    contract: j,
                    inputs: constructor,
                    bytecode: output.contracts[i][j].evm.bytecode.object,
                    abi: output.contracts[i][j].abi
                })
            }
            // console.log(i, j, inTheList)

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
                network_id: smartContract.network_id,
            }
        }
    })
    existRequest.forEach(async i => {
        await i.update({ del: 1 })
    })
    const oldRequest = await smartContract.getRequest()
    if (!oldRequest) {
        const requestNew = await Request.create({})
        await requestNew.setSmartContract(smartContract)
    } else {
        oldRequest.update({ del: 0 })
    }
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

const checkTokenSymbol = async (symbol, userId) => {
    const existToken = await Token.findOne({
        where: { symbol }
    })
    if (existToken) {
        // TODO check
        const tokenOwner = await existToken.getOwner()
        if (tokenOwner.id != userId) {
            throw new ApiError("Symbol has taken")
        }
        return existToken
    }
    return null
}




module.exports = {
    createToken,
    getTokenById,
    getTokenBySymbol,
    validateSource,
    getListToken,
    createRequest,
    cancelRequest,
    testDeploy,
    checkTokenSymbol
}