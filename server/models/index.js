const Account = require("./account")
const Config = require("./config")

const SmartContract = require("./smart_contract")
const File = require("./file")
const Network = require("./network")

const Token = require('./token')
const User = require('./user')
const VCoin = require("./vcoin")

const { sequelize } = require('../configs')


User.hasMany(Account, { as: 'wallets', foreignKey: "user_id" })

SmartContract.belongsTo(Network, { as: "network", foreignKey: "network_id" })
SmartContract.belongsTo(Account, { as: "owner", foreignKey: "account_id" })
SmartContract.hasMany(File, { as: "files", foreignKey: "smart_contract_id" })

VCoin.hasMany(SmartContract, { as: "smart_contracts", foreignKey: "vcoin_id" })
VCoin.belongsTo(User, { as: "owner", foreignKey: "user_id" })

Token.hasMany(SmartContract, { as: "smart_contracts", foreignKey: "token_id" })
Token.belongsTo(User, { as: "owner", foreignKey: "user_id" })

// sequelize.sync({ force: true })
// sequelize.sync({ alter: true })
// sequelize.sync()

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = { User, Token, Config, Account, Network, VCoin, SmartContract, File }
