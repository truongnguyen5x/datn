const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Account = sequelize.define('Account', {
    address: {
        type: DataTypes.STRING,
        validate: {
            is: /^(0x){0,1}[a-fA-F_0-9]{40}$/g
        }
    },
    name: {
        type: DataTypes.STRING,
    },
    key: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            is: /^(0x){0,1}[a-fA-F_0-9]{64}$/g
        }
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