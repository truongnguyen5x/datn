const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
    hash_password: {
        type: DataTypes.STRING
    },
    private_key: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'users'
});

module.exports = User