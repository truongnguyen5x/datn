const { SmartContract, Network, Account, File, Token, User, Request } = require('../models')
const configService = require("./config")
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const { Op } = require("sequelize");
const { getWeb3Instance, getListAccount, exporSdkWorker, compileSourceCode } = require("../utils/network_util");
const VCoin = require("../models/vcoin");

const createToken = async (data, user_id, transaction) => {
    const { source, contract, network, account, constructor } = data
    const accSend = await accountService.getAccountById(account)
    const userSend = await userService.getUserById(user_id)
    if (accSend.user_id != user_id) {
        console.log('khong trung user id')
        throw new ApiError("ERROR")
    }
    const createdSources = await fileService.bulkCreate(source, { transaction })
    const networkSend = await networkService.getNetWorkById(network)
    const web3 = await getWeb3Instance({ provider: networkSend.path })

    await web3.eth.accounts.wallet.add(accSend.key);
    await getListAccount(web3)

    var output = await compileSourceCode(source)
    const constractCompile = output.contracts[contract.file][contract.contract]
    const interface = constractCompile.abi
    const myContract = new web3.eth.Contract(interface)
    const bytecode = constractCompile.evm.bytecode.object;

    const newSmartContract = await SmartContract.create({ deploy_status: 0, abi: JSON.stringify(interface) }, { transaction })
    await newSmartContract.setNetwork(networkSend, { transaction })
    await newSmartContract.setAccount(accSend, { transaction })
    await newSmartContract.setFiles(createdSources, { transaction })

    // myContract.deploy({
    //     data: bytecode,
    //     arguments: constructor
    // }).estimateGas({ gas: 5000000 })
    //     .then(gas => {
    myContract.deploy({
        data: bytecode,
        arguments: constructor
    }).send({
        from: accSend.address,
        gas: 3000000
        // gas
    })
        .on('error', (error) => {
            console.log('error')
        })
        .on('transactionHash', async (transactionHash) => {
            console.log('transactionHash', transactionHash)
            newSmartContract.update({ deploy_status: 1 })
        })
        .on('receipt', async (receipt) => {
            console.log('receipt', receipt.contractAddress) // contains the new contract address
            newSmartContract.update({ deploy_status: 2, address: receipt.contractAddress })
        })
        .on('confirmation', async (confirmationNumber, receipt) => {
            console.log('confirm', confirmationNumber, receipt)
            newSmartContract.update({ deploy_status: 4 })
        })
        .then(async (newContractInstance) => {
            newSmartContract.update({ deploy_status: 3 })
            console.log('then', newContractInstance.options.address) // instance with the new contract address
            return newContractInstance.methods.symbol().call({ from: accSend.address })
        })
        .then(async symbol => {
            let tokenCreated = await Token.findOne({
                where: { symbol }
            })
            if (!tokenCreated) {
                tokenCreated = await Token.create({ symbol })
                tokenCreated.setOwner(userSend)
            }
            tokenCreated.addSmartContract(newSmartContract)
        })
    // })
    return newSmartContract
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
        case "deploying":
            return SmartContract.findAll({
                where: {
                    deploy_status: {
                        [Op.lte]: 3
                    }
                }
            })
        default:
            return []
    }
}


const getTokenById = async (id, type) => {
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
                    del: 0
                },
                required: false
            }]
        }],
        order: [[{ model: SmartContract, as: "smartContracts" }, 'createdAt', 'DESC']]
    })
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
            responses.push({ file: i, contract: j, inputs: constructor })
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
                token_id: token.id
            },
            include: {
                model: Network,
                as: 'network',
                where: {
                    id: smartContract.network_id
                }
            }
        }
    })
    existRequest.forEach(async i => {
        await i.update({ del: 1 })
    })
    const requestNew = await Request.create({})
    await requestNew.setSmartContract(smartContract)
    return requestNew
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


const testContract = async (data) => {
    const vcoin = await VCoin.findOne({
        include: {
            model: Network,
            as: "network"
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
    myContract.methods.getListToken()
        .call({
            from: address
        })
        .then(res => { console.log(res) })
    return

}


const exportSDK = async (id) => {
    const smartContract = await SmartContract.findOne({ where: { id } })
    const token = await smartContract.getToken()
    const interface = JSON.parse(smartContract.abi)
    const network = await smartContract.getNetwork()
    const account = await smartContract.getAccount()

    return exporSdkWorker(token.symbol, smartContract.address, account.key, network.path, interface)
}


module.exports = {
    createToken,
    getTokenById,
    getTokenBySymbol,
    validateSource,
    getListToken,
    createRequest,
    cancelRequest,
    testContract,
    exportSDK
}