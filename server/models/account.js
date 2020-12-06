const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Account = sequelize.define('Account', {
    address: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    key: {
        type: DataTypes.STRING,
        unique: true
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
    tableName: 'accounts'
});

module.exports = Account