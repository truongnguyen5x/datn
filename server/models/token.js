const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Token = sequelize.define('Token', {
    description: {
        type: DataTypes.STRING
    },
    exchange_rate: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    image: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    symbol: {
        type: DataTypes.STRING
    },
    transaction_fee: {
        type: DataTypes.INTEGER.UNSIGNED
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