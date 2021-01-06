const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    hash_password: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User