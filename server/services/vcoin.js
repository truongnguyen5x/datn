const { VCoin, SmartContract, Network, Account, File, Token } = require('../models')
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const ApiError = require("../middlewares/error")

const solc = require("solc");
const { getWeb3Instance, getListAccount } = require("../utils/network_util")

const getListVCoin = async (filter) => {
    const used = (filter == 'used')
    return VCoin.findAll({
        where: {
            used
        },
        include: [{
            model: SmartContract,
            as: "smartContract",
            where: {
                del: 0
            },
            include: [{
                model: Network,
                as: 'network'
            }, {
                model: Account,
                as: 'owner'
            }]
        }]
    })
}

const getVCoinById = async (id) => {
    return VCoin.findOne({
        where: {
            id
        },
        include: [{
            model: SmartContract,
            as: "smartContract",
            where: {
                del: 0
            },
            include: [{
                model: Network,
                as: 'network'
            }, {
                model: Account,
                as: 'owner'
            }, {
                model: File,
                as: "files"
            }]
        }]
    })
}

const createVCoin = async (data, user_id, transaction) => {
    const { source, contract, network, account, symbol } = data
    const accSend = await accountService.getAccountById(account)
    const userSend = await userService.getUserById(user_id)
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
    const web3 = await getWeb3Instance({ provider: networkSend.path })
    console.log(accSend.key)
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
        input.sources[i.name] = {
            content: i.code
        }
    });
    var output = JSON.parse(
        solc.compile(JSON.stringify(input))
    );
    const constractCompile = output.contracts["Main.sol"][contract]
    const interface = constractCompile.abi
    const myContract = new web3.eth.Contract(interface)
    const bytecode = constractCompile.evm.bytecode.object;

    const newSmartContract = await SmartContract.create({ deploy_status: 0 })
    await newSmartContract.setNetwork(networkSend)
    await newSmartContract.setOwner(accSend)
    await newSmartContract.setFiles(createdSources)
    const newVCoin = await VCoin.create({})
    await newVCoin.setSmartContract(newSmartContract)
    await newVCoin.setOwner(userSend)

    myContract.deploy({
        data: bytecode,
        arguments: [1000000, "vcoin", "vcn"]
    }).send({
        from: accSend.address,
        gas: 3000000
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
        });

    return newVCoin
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