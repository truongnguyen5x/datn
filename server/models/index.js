const Account = require("./account")
const Config = require("./config")

const SmartContract = require("./smart_contract")
const File = require("./file")
const Network = require("./network")

const Token = require('./token')
const User = require('./user')
const VCoin = require("./vcoin")
const Request = require("./request")

const { sequelize } = require('../configs')


User.hasMany(Account, { as: 'wallets', foreignKey: "user_id" })

SmartContract.hasMany(File, { as: "files", foreignKey: "smart_contract_id" })
SmartContract.hasMany(SmartContract, { as: "tokens", foreignKey: "vcoin_id" })


Token.hasMany(SmartContract, { as: "smartContracts", foreignKey: "token_id" })
SmartContract.belongsTo(Token, { as: "token", foreignKey: "token_id" })
Token.belongsTo(User, { as: "owner", foreignKey: "user_id" })
User.hasMany(Token, { as: "tokens", foreignKey: "user_id" })

Request.belongsTo(SmartContract, { as: "smartContract", foreignKey: "smart_contract_id" })
SmartContract.hasOne(Request, { as: "request", foreignKey: "smart_contract_id" })

// sequelize.sync({ force: true })
// VCoin.sync({ alter: true })
// SmartContract.sync({ alter: true })
// sequelize.sync()

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = { User, Token, Config, Account, Network, VCoin, SmartContract, File, Request }
