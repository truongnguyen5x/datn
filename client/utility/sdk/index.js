
import JSZip from 'jszip'
/**
 * 
 * @param {string} zipName name of zip file, and name of root folder in zip
 * @param {Object[]} data data struct of zip file
 * @param {string} data[].path file name or folder name 
 * @param {string} data[].content content of file
 * @param {Object[]} data[].child list file or folder in this folder
 */
const exportToZip = (zipName, data) => {
  const zip = new JSZip();
  const addToZip = (root, file) => {
    if (file.child) {
      const fol = root.folder(file.path)
      file.child.forEach(i => addToZip(fol, i))
    } else {
      root.file(file.path, file.content)
    }
  }
  const root = zip.folder(zipName)
  data.forEach(i => addToZip(root, i))
  return zip
}


/**
 * Function export a SDK 
 * @param {string} address address of smart contract
 * @param {string} network network url deploy smart contract
 * @param {Object} abi abi interface of smart contract
 */
const exporSdkWorker = (name, account, address, network_id, abi, username) => {

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
    username,
    account,
    address,
    network_id
  }
  const functionList = abi.filter(i => i.type == "function")

  const renderParams = (inputs) => {
    return inputs.map((i, idx) => i.name ? i.name : `param${idx}`).join(', ')
  }
  const renderParamsFrontend = (inputs) => {
    if (inputs.length == 0) {
      return 'fromAddress'
    } else
      return inputs.map((i, idx) => i.name ? i.name : `param${idx}`).join(', ') + ", fromAddress"
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


  const renderMedthodFrontend = methods => {
    const { stateMutability, inputs } = methods
    if (stateMutability == "view") {
      return `
${renderJsDoc(inputs)}
Token${name}.prototype.${methods.name} = async function (${renderParamsFrontend(inputs)}) {
  if (fromAddress) {
      return this.${name}Contract.methods.${methods.name}(${renderParams(inputs)}).call({from: fromAddress});
  } else {
      return  this.${name}Contract.methods.${methods.name}(${renderParams(inputs)}).call();
  }
};`
    } else {
      return `
${renderJsDoc(inputs)} 
Token${name}.prototype.${methods.name} = async function (${renderParamsFrontend(inputs)}) {
  return new Promise((resolve, reject) => {
    this.${name}Contract.methods.${methods.name}(${renderParams(inputs)})
    .estimateGas({from:fromAddress })
    .then(gas => {
      this.${name}Contract.methods.${methods.name}(${renderParams(inputs)}).send({
        from: fromAddress, gas: gas + 1000000
      }, (error, result) => {
        if (error) {
            console.log('error in ${methods.name}' + error);
            reject(error)
        }
        resolve(result)
      });
    })
  })
};
`
    }
  };

  const frontendSdk =
    `
const DappContract = require('./contracts/${name}.json');

const version = require('./package.json').version;
const config = require('./config/config.json');

function Token${name}(web3) {
  this.web3 = web3;
  this.${name}Contract = new web3.eth.Contract(
      DappContract,
      config.address
    )
    
}



Token${name}.version = version;
Token${name}.address = config.address;
${functionList.map(i => renderMedthodFrontend(i)).join("")}  
module.exports = Token${name}

`


  const zip = new JSZip();
  const root = zip.folder(name);
  root.file('package.json', JSON.stringify(packageFile, null, 4))
  root.file('index.js', frontendSdk)
  const contracts = root.folder('contracts')
  contracts.file(`${name}.json`,JSON.stringify(abi, null, 4) )
  const config = root.folder('config')
  config.file("config.json", JSON.stringify(configContent, null, 4))
  return zip
}

export {
  exportToZip,
  exporSdkWorker
}