const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Token = sequelize.define('Token', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
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
    tableName: 'tokens'
});

module.exports = Token