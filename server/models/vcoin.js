const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const VCoin = sequelize.define('VCoin', {
    abi: {
        type: DataTypes.TEXT
    },
    account: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    network_id: {
        type: DataTypes.BIGINT,
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