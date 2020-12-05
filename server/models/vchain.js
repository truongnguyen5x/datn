const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const VChain = sequelize.define('VChain', {
    name: {
        type: DataTypes.STRING
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
    tableName: 'vchains'
});

module.exports = VChain