var VCoin = artifacts.require("VCoin");

module.exports = function (deployer, network) {
    // deployment steps
    deployer.deploy(VCoin);
};