const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const SmartContract = sequelize.define('SmartContract', {
    del: {
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
    tableName: 'smart_contracts'
});

module.exports = SmartContract