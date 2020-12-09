const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const SmartContract = sequelize.define('SmartContract', {
    abi: {
        type: DataTypes.TEXT
    },
    address: {
        type: DataTypes.STRING,
    },
    del: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deploy_status: {
        type: DataTypes.INTEGER,
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