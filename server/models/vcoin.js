const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const VCoin = sequelize.define('VCoin', {
    abi: {
        type: DataTypes.TEXT
    },
    address: {
        type: DataTypes.STRING,
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
    tableName: 'vcoins'
});

module.exports = VCoin