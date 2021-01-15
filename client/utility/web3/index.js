import Web3 from "web3";

const getWeb3 = () =>
    new Promise(async (resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        // window.addEventListener("load", async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                // Request account access if needed
                await window.ethereum.enable();
                // Acccounts now exposed
                resolve(web3);
            } catch (error) {
                reject(error);
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            // Use Mist/MetaMask's provider.
            const web3 = window.web3;
            console.log("Injected web3 detected.");
            resolve(web3);
        }
        // Fallback to localhost; use dev console port by default...
        // else {
        //     const provider = new Web3.providers.HttpProvider(
        //         "http://127.0.0.1:8545"
        //     );
        //     const web3 = new Web3(provider);
        //     console.log("No web3 instance injected, using Local web3.");
        //     resolve(web3);
        // }
        resolve(null)
        // });
    });

const getNetType = (netId) => {
    switch (netId) {
        case 1:
            return 'mainnet'
        case 42:
            return 'kovan'
        case 3:
            return 'ropsten'
        case 4:
            return 'rinkeby'
        case 5:
            return 'goerli'
        default:
            return 'localhost'
    }
}

const sendWithEstimateGas = (send, from) => {
    return new Promise((resolve, reject) => {
        send.estimateGas()
            .then(gas => {
                console.log('estimate gas')
                send.send({
                        from,
                        gas: gas + 1000000
                    })
                    .on('transactionHash', (hash) => {
                        console.log('transactionHash', hash)
                    })
                    .on('receipt', async (receipt) => {
                        console.log('receipt', receipt)
                        resolve()
                    })
                    .on('error', err => {
                        console.log('err')
                        reject(err)
                    });
            })
            .catch(error => {
                console.log('estimate error', error)
            })
    })
}

const deployWithEstimateGas = (send, from) => {
    let address
    return new Promise((resolve, reject) => {
        send.estimateGas()
            .then(gas => {
                console.log('estimate gas')
                send.send({
                        from,
                        gas: gas + 1000000
                    })
                    .on('error', (error) => {
                        console.log('deploy error', error)
                        reject(error)
                    })
                    .on('transactionHash', async (transactionHash) => {
                        console.log('transactionHash', transactionHash)
                    })
                    .on('receipt', async (receipt) => {
                        console.log('receipt', receipt)
                        address = receipt.contractAddress
                    })
                    .on('confirmation', async (confirmationNumber, receipt) => {
                        console.log('confirm', confirmationNumber, receipt)
                    })
                    .then(instance => {
                        resolve(instance)
                    })
            })
    })
}

export {
    getWeb3, getNetType, sendWithEstimateGas, deployWithEstimateGas
};
