var VCoin = artifacts.require("VCoin");

module.exports = function (deployer, network) {
    console.log(accounts)
    // deployment steps
    deployer.deploy(VCoin);
};