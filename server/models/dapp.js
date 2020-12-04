const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Dapp = sequelize.define('Dapp', {
    name: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    del: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    image: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'dapps'
});

module.exports = Dapp