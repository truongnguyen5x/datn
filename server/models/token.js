const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    symbol: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    del: {
        type: DataTypes.BOOLEAN
    },
    deploy_status: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    exchange_rate: {
        type: DataTypes.INTEGER.UNSIGNED
    }
}, {
    tableName: 'tokens'
});

module.exports = Token