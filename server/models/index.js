const Account = require("./account")
const Config = require("./config")
const Contract = require("./contract")
const Deploy = require("./deploy")
const File = require("./file")
const Network = require("./network")
const SourceCode = require("./source_code")
const TemplateToken = require('./template_token')
const Token = require('./token')
const User = require('./user')
const VChain = require("./vchain")

const { sequelize } = require('../configs')

SourceCode.belongsToMany(File, { through: "source_code_file" })

User.hasMany(Account, { as: 'wallets', foreignKey: "user_id" })

Deploy.belongsTo(Network, { as: "network", foreignKey: "network_id" })
Deploy.belongsTo(Account, { as: "owner", foreignKey: "account_id" })


Contract.hasMany(Deploy, { as: "contract", foreignKey: "contract_id" })
Contract.belongsTo(SourceCode, { as: "source", foreignKey: "source_id" })

VChain.belongsTo(Contract, { as: "contract", foreignKey: "contract_id" })
VChain.belongsTo(User, { as: "owner", foreignKey: "user_id" })
Token.belongsTo(Contract, { as: "contract", foreignKey: "contract_id" })
Token.belongsTo(User, { as: "owner", foreignKey: "user_id" })

TemplateToken.belongsTo(SourceCode, { as: "source", foreignKey: "source_id" })

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
module.exports = { User, Token, TemplateToken, Config, Account, Contract, Network, SourceCode, VChain, Deploy, File }
