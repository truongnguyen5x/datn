const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const VCoin = sequelize.define('VCoin', {
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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