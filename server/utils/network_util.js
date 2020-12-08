const Web3 =require('web3')

const getWeb3Instance = async data => {
    const {provider} = data
    const web = new Web3(provider);
    await web.eth.net.isListening()
    return web
}

module.exports = {
    getWeb3Instance
}