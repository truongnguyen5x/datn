const Web3 = require('web3')
const solc = require("solc");

/**
 * Create a web3 instance
 * @param {Object} data
 * @param {string} data.provider network url of blockchain
 */
const getWeb3Instance = async data => {
    const { provider } = data
    const web = new Web3(provider);
    await web.eth.net.isListening()
    console.log('web3 listen on network ' + provider)
    return web
}

/**
 * Get list account avaiable in web3
 * @param {Object} web3 web3 instance
 */
const getListAccount = async web3 => {
    const acc = await web3.eth.getAccounts()
    console.log('List account avaiable \n', acc)
}



/**
 * Function use solc to compile source code
 * @param {Object[]} data  data for compile source code
 * @param {string} data[].path path of file in source code
 * @param {string} data[].code source code of a file
 */
const compileSourceCode = async (data) => {
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
    return output
}


module.exports = {
    getWeb3Instance,
    getListAccount,
    compileSourceCode
}

