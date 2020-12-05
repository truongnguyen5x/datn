const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Deploy = sequelize.define('Deploy', {
    address: {
        type: DataTypes.STRING,
    },
    deploy_status: {
        type: DataTypes.INTEGER,
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
    tableName: 'deploys'
});

module.exports = Deploy