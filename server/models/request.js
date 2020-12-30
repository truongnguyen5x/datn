const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Request = sequelize.define('Request', {
    accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
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
    tableName: 'requests'
});

module.exports = Request