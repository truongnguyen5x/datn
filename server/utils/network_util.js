const Web3 = require('web3')

const getWeb3Instance = async data => {
    const { provider } = data
    const web = new Web3(provider);
    await web.eth.net.isListening()
    return web
}

const getListAccount = async web3 => {
    const acc = await web3.eth.getAccounts()
    console.log(acc)
}
module.exports = {
    getWeb3Instance,
    getListAccount
}

