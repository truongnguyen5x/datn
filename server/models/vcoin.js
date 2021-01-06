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
    }
}, {
    tableName: 'vcoins',
    timestamps: true
});

module.exports = VCoin