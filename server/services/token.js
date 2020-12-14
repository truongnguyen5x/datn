const path = require("path");
const { SmartContract, Network, Account, File, Token, User, Request } = require('../models')
const fs = require("fs-extra");
const Web3 = require('web3')
const configService = require("./config")
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const solc = require("solc");
const { Op } = require("sequelize");
const { getWeb3Instance, getListAccount } = require("../utils/network_util");
const VCoin = require("../models/vcoin");

const createToken = async (data, user_id, transaction) => {
    const { source, contract, network, account, constructor } = data
    const accSend = await accountService.getAccountById(account)
    const userSend = await userService.getUserById(user_id)
    if (accSend.user_id != user_id) {
        console.log('khong trung user id')
        throw new ApiError("ERROR")
    }


    const createdSources = await fileService.bulkCreate(source)
    const networkSend = await networkService.getNetWorkById(network)
    const web3 = await getWeb3Instance({ provider: networkSend.path })

    await web3.eth.accounts.wallet.add(accSend.key);
    await getListAccount(web3)

    const input = {
        language: 'Solidity',
        sources: {

        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }
    source.forEach(i => {
        input.sources[i.path] = {
            content: i.code
        }
    });
    var output = JSON.parse(
        solc.compile(JSON.stringify(input))
    );
    const constractCompile = output.contracts[contract.file][contract.contract]
    const interface = constractCompile.abi
    const myContract = new web3.eth.Contract(interface)
    const bytecode = constractCompile.evm.bytecode.object;

    const newSmartContract = await SmartContract.create({ deploy_status: 0, abi: JSON.stringify(interface) })
    await newSmartContract.setNetwork(networkSend)
    await newSmartContract.setOwner(accSend)
    await newSmartContract.setFiles(createdSources)

    myContract.deploy({
        data: bytecode,
        arguments: constructor
    }).estimateGas({ gas: 5000000 })
        .then(gas => {
            myContract.deploy({
                data: bytecode,
                arguments: constructor
            }).send({
                from: accSend.address,
                gas
            })
                .on('error', function (error) {
                    console.log('error', error)
                })
                .on('transactionHash', async (transactionHash) => {
                    newSmartContract.update({ deploy_status: 1 })
                    console.log('transactionHash', transactionHash)
                })
                .on('receipt', async (receipt) => {
                    newSmartContract.update({ deploy_status: 2, address: receipt.contractAddress })
                    console.log('receipt', receipt.contractAddress) // contains the new contract address
                })
                .on('confirmation', async (confirmationNumber, receipt) => {
                    newSmartContract.update({ deploy_status: 4 })
                    console.log('confirm', confirmationNumber, receipt)
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
        })
    return newSmartContract
}


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

const getListPersonalToken = async (user_id, type) => {
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


const getTokenById = async (id, data) => {
    if (data.type == "pending") {
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
                    as: 'owner'
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
    } else return Token.findOne({
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
                as: 'owner'
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




const updateToken = async (data, oldData) => {
    const { transaction_fee, exchange_rate } = data
    if (transaction_fee != oldData.transaction_fee || exchange_rate != oldData.exchange_rate) {
        const account = await getMainAccount()
        const tokenContract = await getTokenContract(oldData.address)
        return tokenContract.methods.setFee(transaction_fee, exchange_rate)
            .send({ from: account, gas: 4700000 })
            .then(res => {
                return Token.update(data, { where: { id: data.id } })
            })
            .catch(error => {
                return error
            })

    } else {
        return Token.update(data, { where: { id: data.id } })
    }
}

const deleteToken = async (data) => {
    const { symbol, id } = data
    const mainContract = await getMainConstract()
    const account = await getMainAccount()
    return mainContract.methods.removeToken(symbol)
        .send({ from: account, gas: 4700000 })
        .then(res => {
            console.log('Delete token success')
            return Token.update({ del: true }, { where: { id } })
        })
}

const getProvider = async () => {
    let network = await configService.getConfigByKey("NETWORK")
    network = network.value
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(network));
    await web3.eth.net.isListening()
    return web3
}

const getMainConstract = async () => {
    let vcoinAddress = await configService.getConfigByKey("VCOIN_ADDRESS")
    vcoinAddress = vcoinAddress.value
    const web3 = await getProvider()
    const mainContractPath = path.resolve(__dirname, "../../contract/build/VCoin.json");
    const sourceCodeMain = fs.readFileSync(mainContractPath).toString();
    const codeCompile = JSON.parse(sourceCodeMain)
    const mainContract = new web3.eth.Contract(codeCompile.abi, vcoinAddress)
    return mainContract
}

const getTokenContract = async (contractAddress) => {
    const web3 = await getProvider()
    const contractPath = path.resolve(__dirname, "../../contract/build/Token.json");
    const sourceCode = fs.readFileSync(contractPath).toString();
    const codeCompile = JSON.parse(sourceCode)
    const contractJSON = new web3.eth.Contract(codeCompile.abi, contractAddress)
    return contractJSON
}

const getMainAccount = async () => {
    let account = await configService.getConfigByKey("VCOIN_OWNER")
    return account.value
}

const validateSource = async (data) => {
    const input = {
        language: 'Solidity',
        sources: {

        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }
    data.forEach(i => {
        input.sources[i.path] = {
            content: i.code
        }
    });
    var output = JSON.parse(
        solc.compile(JSON.stringify(input))
    );

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

const acceptRequest = async (data) => {
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

    const privateKey = (await configService.getConfigByKey("KEY_ADMIN")).value
    const web3 = new Web3(vcoin.network.path)
    const { address } = web3.eth.accounts.privateKeyToAccount(privateKey);
    const interface = JSON.parse(vcoin.abi)
    const myContract = new web3.eth.Contract(interface, vcoin.address)
    await web3.eth.accounts.wallet.add(privateKey);
    myContract.methods.addToken(smartContract.address)
        .estimateGas({ gas: 5000000 })
        .then(gas => {
            myContract.methods.addToken(smartContract.address)
                .send({
                    from: address,
                    gas
                })
                .on('error', function (error) {
                    console.log('error', error)
                })
                .on('transactionHash', async (transactionHash) => {

                    console.log('transactionHash', transactionHash)
                })
                .on('receipt', async (receipt) => {

                    console.log('receipt', receipt.contractAddress) // contains the new contract address
                })
                .on('confirmation', async (confirmationNumber, receipt) => {

                    console.log('confirm', confirmationNumber, receipt)
                })
                .then(async (newContractInstance) => {
                    console.log('then', newContractInstance.options.address)
                })
        })

    await requestNew.update({ accepted: 1 })
    // await requestNew.destroy()
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
    createToken,
    getListToken,
    getTokenById,
    updateToken,
    deleteToken,
    getProvider,
    getMainConstract,
    getMainAccount,
    getTokenContract,
    getTokenBySymbol,
    validateSource,
    getListPersonalToken,
    createRequest,
    cancelRequest,
    acceptRequest,
    denyRequest
}