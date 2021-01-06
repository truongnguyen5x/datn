const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Token = sequelize.define('Token', {
    description: {
        type: DataTypes.STRING
    },
    exchange_rate: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 100
    },
    image: {
        type: DataTypes.STRING
    },
    initial_supply: {
        type: DataTypes.STRING
    }, 
    name: {
        type: DataTypes.STRING
    },
    symbol: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'tokens',
    timestamps: true
});

module.exports = Token