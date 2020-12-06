const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Network = sequelize.define('Network', {
    path: {
        type: DataTypes.STRING,
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
    tableName: 'networks'
});

module.exports = Network