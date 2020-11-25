const Sequelize = require('sequelize')
const constants = require('./constants');


const info =  {
    dev: {
        username: constants.DB_USERNAME,
        password: constants.DB_PASSWORD,
        dialect: 'mysql',
        port: constants.DB_PORT,
        host: constants.DB_HOST,
        database: constants.DB_NAME
    },
    production: {
        username: constants.DB_USERNAME,
        password: constants.DB_PASSWORD,
        dialect: 'mysql',
        port: constants.DB_PORT,
        host: constants.DB_HOST,
        database: constants.DB_NAME
    }
}

module.exports = new Sequelize(info[constants.NODE_ENV])