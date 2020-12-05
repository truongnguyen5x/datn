const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Token = sequelize.define('Token', {
    symbol: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    exchange_rate: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    transaction_fee: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    description: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    }
}, {
    tableName: 'tokens'
});

module.exports = Token