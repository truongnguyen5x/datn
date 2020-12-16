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
 * Function export a SDK 
 * @param {string} address address of smart contract
 * @param {string} key private key of smart contract's owner
 * @param {string} network network url deploy smart contract
 * @param {Object} abi abi interface of smart contract
 */
const exporSdkWorker = async (name, address, key, network, abi) => {
    console.log(name, address, key, network)

    const packageFile = {
        name: `sdk-token-${name}`,
        version: "1.0.0",
        description: `Token ${name} JavaScript SDK`,
        engines: {
            node: ">=8.0.0"
        },
        license: "ISC",
        main: "index.js",
        keywords: [
            "Ethereum",
            "JavaScript",
            "API"
        ],
        scripts: {
            start: "node index.js"
        },
        dependencies: {
            "@types/node": "^12.6.1",
            "web3": "1.2.2"
        },
        devDependencies: {
            "definitelytyped-header-parser": "^1.0.1",
            "dtslint": "0.4.2"
        }
    }
    const configContent = {
        username: "Thầy Minh Nhựa",
        private_key: key,
        address,
        provider: network
    }
    const functionList = abi.filter(i => i.type == "function")

    const renderParams = (inputs) => {
        return inputs.map(i => i.name).join(', ')
    }

    const renderJsDoc = (inputs) => {
        if (!inputs.length) {
            return ""
        }
        const listParamDoc = inputs.map(i => {
            let type = "string"
            switch (i.type) {
                case "int8":
                case "int16":
                case "int32":
                case "int64":
                case "int128":
                case "int256":
                case "uint8":
                case "uint16":
                case "uint32":
                case "uint64":
                case "uint128":
                case "uint256":
                    type = "number"
                    break
                case "bool":
                    type = "boolean";
                    break
                default:
                    break
            }
            return ` * @param {${type}} ${i.name}`
        })
        return `    
/**
 * 
${listParamDoc.join("\n")} 
 */`
    }

    const renderMedthods = methods => {
        const { stateMutability, inputs } = methods
        if (stateMutability == "view") {
            return `
${renderJsDoc(inputs)}
Token${name}.${methods.name} = async function (${renderParams(inputs)}) {
    const response = await ${name}Contract.methods.${methods.name}(${renderParams(inputs)}).call();
    return response;
};`
        } else {
            return `
${renderJsDoc(inputs)} 
Token${name}.${methods.name} = async function (${renderParams(inputs)}) {
    await ${name}Contract.methods.${methods.name}(${renderParams(inputs)}).send({
        from: address, gas: 300000
    }, (error, result) => {
        if (error) {
            console.log('error in ${methods.name}' + error);
            return 0;
        }
        return result;
    });
};
`
        }
    };
    const tokenContent =
        `"use strict";

const Web3 = require('web3');
const DappContract = require('./contracts/${name}.json');

const version = require('./package.json').version;

const config = require('./config/config.json');

const web3Provider = new Web3.providers.HttpProvider(config.provider);
const web3 = new Web3(web3Provider);
const { address } = web3.eth.accounts.privateKeyToAccount(config.private_key);
web3.eth.accounts.wallet.add(config.private_key);
const ${name}Contract = new web3.eth.Contract(
  DappContract,
  config.address
)

let Token${name} = {};

Token${name}.version = version;
${functionList.map(i => renderMedthods(i)).join("")}    
    
module.exports = Token${name};
`

    return {
        name,
        zip: [{
            path: "pakage.json",
            content: JSON.stringify(packageFile, null, 4)
        }, {
            path: "contracts",
            child: [{
                path: `${name}.json`,
                content: JSON.stringify(abi, null, 4)
            }]
        }, {
            path: "config",
            child: [{
                path: "config.json",
                content: JSON.stringify(configContent, null, 4)
            }]
        }, {
            path: "index.js",
            content: tokenContent
        }]
    }
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
    exporSdkWorker,
    compileSourceCode
}

