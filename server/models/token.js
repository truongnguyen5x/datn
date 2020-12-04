const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Token = sequelize.define('Token', {
    symbol: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    del: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    image: {
        type: DataTypes.STRING
    },
    deploy_status: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    exchange_rate: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    transaction_fee: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    address: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'tokens'
});

module.exports = Token