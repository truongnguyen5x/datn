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
    }
}, {
    tableName: 'requests',
    timestamps: true
});

module.exports = Request