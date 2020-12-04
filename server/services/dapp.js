const { Dapp, Token } = require('../models')
const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const tokenService = require("./token")
const { getProvider, getMainAccount } = require("./token")

const getListDapp = async () => {
    return Dapp.findAll({
        include: Token
    })
}

const getDappById = async (id) => {
    return Dapp.findOne({
        where: { id },
        include: Token
    })
}

const createDapp = async (data) => {

    const contractspath = path.resolve(__dirname, "../../contract/src/Lib.sol");
    const sourceCodeLib = fs.readFileSync(contractspath).toString();

    const input = {
        language: 'Solidity',
        sources: {
            'Lib.sol': {
                content: sourceCodeLib
            },
            'Dapp.sol': {
                content: data.code
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

    const compileCode = JSON.parse(solc.compile(JSON.stringify(input)), 1)
    const constract = compileCode.contracts["Dapp.sol"]["DAPP1"]

    const interface = constract.abi
    const bytecode = constract.evm.bytecode.object;
    const web3 = await getProvider()
    const myContract = new web3.eth.Contract(interface);

    const account = await getMainAccount()
  
    return myContract.deploy({ data: bytecode }).send({
        from: account,
        gas: 4700000
    })
        .then(async newContractInstance => {
            data.address = newContractInstance.options.address
            const { tokens } = data

            const createdDapp = await Dapp.create(data)

            tokens.forEach(async i => {
                const token = await tokenService.getTokenBySymbol(i)
                await createdDapp.addToken(token)
            })
            return createdDapp;
        })
}

const updateDapp = async (data) => {
    const { tokens } = data
    console.log(data)
    const dapp = await Dapp.findOne({
        where: { id: data.id }
    })
    const p_w = tokens.map(async i => {
        return tokenService.getTokenBySymbol(i)
    })
    const listToken = await Promise.all(p_w)
    await dapp.setTokens(listToken)
    return Dapp.update(data, { where: { id: data.id } })
}

const deleteDapp = async (id) => {
    return Dapp.destroy({ where: { id } })
}

module.exports = {
    getListDapp,
    getDappById,
    createDapp,
    updateDapp,
    deleteDapp
}