const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const SmartContract = sequelize.define('SmartContract', {
    abi: {
        type: DataTypes.TEXT
    },
    account: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    bytecode: {
        type: DataTypes.TEXT,
    }, 
    constructor_data: {
        type: DataTypes.STRING,
    },
    // network_id: {
    //     type: DataTypes.BIGINT,
    // },
    del: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deploy_status: {
        type: DataTypes.INTEGER,
    },
    // createdAt: {
    //     type: DataTypes.DATE,
    //     defaultValue: new Date()
    // },
    // updatedAt: {
    //     type: DataTypes.DATE,
    //     defaultValue: new Date()
    // }
}, {
    tableName: 'smart_contracts',
    timestamps: true
});

module.exports = SmartContract