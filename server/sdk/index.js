const { network, pk } = require("./secret")
const Web3 = require('web3')
const web3 = new Web3(network)

const getListToken = () => {
    return [1,2,3]
}

module.exports = {
    getListToken
}