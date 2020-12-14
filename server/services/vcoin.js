const { VCoin, SmartContract, Network, Account, File, Token } = require('../models')
const userService = require("./user")
const accountService = require("./account")
const networkService = require("./network")
const fileService = require("./file")
const configService = require("./config")
const ApiError = require("../middlewares/error")
const path = require('path')
const AdmZip = require('adm-zip');
const Web3 = require('web3')

const solc = require("solc");
const { getWeb3Instance, getListAccount } = require("../utils/network_util")

const getListVCoin = async () => {
    const web3 = new Web3()
    const config = await configService.getConfigByKey("KEY_ADMIN")
    const { address } = web3.eth.accounts.privateKeyToAccount(config.value);

    const rs = await Network.findAll({
        include: [{
            model: VCoin,
            as: "vcoins"
        }],
        order: [
            ["createdAt", 'DESC'],
            [{ model: VCoin, as: "vcoins" }, "createdAt", 'DESC']
        ]
    })
    return {
        address_account: address,
        address: rs
    }
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

const createVCoin = async (data, transaction) => {
    const { network } = data
    const file1 = await configService.getConfigByKey("LIB.SOL")
    const file2 = await configService.getConfigByKey("MAIN.SOL")
    const private_key = await configService.getConfigByKey("KEY_ADMIN")
    const networkSend = await networkService.getNetWorkById(network)
    const web3 = await getWeb3Instance({ provider: networkSend.path })
    const { address } = web3.eth.accounts.privateKeyToAccount(private_key.value);
    await web3.eth.accounts.wallet.add(private_key.value);
    await getListAccount(web3)

    const input = {
        language: 'Solidity',
        sources: {
            "Lib.sol": {
                content: file1.value
            },
            "Main.sol": {
                content: file2.value
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }

    var output = JSON.parse(
        solc.compile(JSON.stringify(input))
    );
    const constractCompile = output.contracts["Main.sol"]["VCoin"]
    const interface = constractCompile.abi
    const myContract = new web3.eth.Contract(interface)
    const bytecode = constractCompile.evm.bytecode.object;

    const newVCoin = await VCoin.create({ abi: JSON.stringify(interface) })
    await newVCoin.setNetwork(networkSend)

    // myContract.deploy({
    //     data: bytecode,
    //     arguments: [1000000, "vcoin", "vcn"]
    // }).estimateGas({ gas: 5000000 })
    //     .then(gas => {
            myContract.deploy({
                data: bytecode,
                arguments: [1000000, "vcoin", "vcn"]
            }).send({
                from: address,
                gas: 5000000
            })
                .on('receipt', async (receipt) => {
                    newVCoin.update({ address: receipt.contractAddress })
                    console.log('receipt', receipt.contractAddress) // contains the new contract address
                })
        // })

    return newVCoin
}

const updateVCoin = async (data) => {
    const { network, address } = data
    const sendNetwork = await networkService.getNetWorkById(network)
    const coin = await VCoin.create({ address })
    await coin.setNetwork(sendNetwork)
    return coin
}

const deleteVCoin = async (id) => {
    return VCoin.destroy({ where: { id } })
}

const exportSDK = async () => {
    const zip = new AdmZip();
    zip.addLocalFile(path.resolve(__dirname, "../sdk/index.js"));
    zip.addLocalFile(path.resolve(__dirname, "../sdk/secret.js"));
    zip.writeZip(path.resolve(__dirname, "../sdk/sdk.zip"))
    return path.resolve(__dirname, "../sdk/sdk.zip")
}

module.exports = {
    getListVCoin,
    getVCoinById,
    createVCoin,
    updateVCoin,
    deleteVCoin,
    exportSDK
}