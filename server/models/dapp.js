const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Dapp = sequelize.define('Dapp', {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'dapps'
});

module.exports = Dapp