const { VCoin, SmartContract, Network, Account, File, Token, Config, Request } = require('../models')
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const configService = require("./config")
const ApiError = require("../middlewares/error")
const { Op } = require('sequelize')
const Web3 = require('web3')
const { getWeb3Instance, compileSourceCode, getNetType } = require("../utils/network_util");




const getListVCoin = async () => {
    const mainnet = VCoin.findOne({
        where: { network_id: 1 },
        order: [["createdAt", 'DESC']]
    })
    const kovan = VCoin.findOne({
        where: { network_id: 42 },
        order: [["createdAt", 'DESC']]
    })
    const ropsten = VCoin.findOne({
        where: { network_id: 3 },
        order: [["createdAt", 'DESC']]
    })
    const rinkeby = VCoin.findOne({
        where: { network_id: 4 },
        order: [["createdAt", 'DESC']]
    })
    const goerli = VCoin.findOne({
        where: { network_id: 5 },
        order: [["createdAt", 'DESC']]
    })
    const local = VCoin.findOne({
        where: {
            network_id: {
                [Op.notIn]: [1, 42, 3, 4, 5]
            }
        },
        order: [["createdAt", 'DESC']]
    })
    const pr = await Promise.all([mainnet, kovan, ropsten, rinkeby, goerli, local])
    return pr
}

const getVCoinById = async (id) => {
    return VCoin.findOne({
        where: {
            id
        },
        include: {
            model: Network,
            as: 'network'
        }
    })
}

const createVCoin = async (data, user_id) => {
    const { abi, network_id, account, address } = data
    const netChain = getNetType(network_id)
    const network = await Network.findOne({ where: { chain_id: netChain } })
    await Request.update({ del: true, accepted: false }, {
        where: {
            accepted: 1,
            del: 0
        },
        include: {
            model: SmartContract,
            as: 'smartContract',
            where: {
                network_id: network.id
            }
        }
    })
    return VCoin.create({ abi: JSON.stringify(abi), network_id, account, address })
}

const updateVCoin = async (data) => {
    const { id, fee } = data
    const vcoin = await VCoin.findOne({ where: { id } })
    await vcoin.update({ swap_fee: fee })
    return vcoin
}

const deleteVCoin = async (id) => {
    return VCoin.destroy({ where: { id } })
}


const testDeploy = async (data, userId) => {
    const private_key = await configService.getConfigByKey("KEY_ADMIN")
    const network = await networkService.getNetWorkById(3)
    const web3 = await getWeb3Instance({ provider: network.path })
    const { address } = web3.eth.accounts.privateKeyToAccount(private_key.value);
    await web3.eth.accounts.wallet.add(private_key.value);

    const myContract = new web3.eth.Contract(data.abi)
    let newContractInstance
    // estimateGas
    return myContract.deploy({
        data: data.bytecode,
        arguments: data.constructor
    }).estimateGas()
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
            return 'success'
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

            // console.log(i, j, inTheList)

        })
    })

    return responses
}


module.exports = {
    getListVCoin,
    getVCoinById,
    createVCoin,
    updateVCoin,
    deleteVCoin,
    testDeploy,
    validateSource
}