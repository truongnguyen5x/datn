const User = require('./user')
const Token = require('./token')
const TemplateToken = require('./template_token')
const TemplateDapp = require('./template_dapp')
const Config = require("./config")
const Dapp = require("./dapp")
const { sequelize } = require('../configs')

Dapp.belongsToMany(Token, { through: 'dapp_tokens' })
Token.belongsToMany(Dapp, { through: 'dapp_tokens' })

sequelize.sync()

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = { User, Token, TemplateToken, Config, Dapp , TemplateDapp}