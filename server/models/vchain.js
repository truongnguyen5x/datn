const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const VChain = sequelize.define('VChain', {
    del: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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