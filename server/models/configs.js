const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Config = sequelize.define('Token', {
    key: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    value: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'configs'
});

module.exports = Config