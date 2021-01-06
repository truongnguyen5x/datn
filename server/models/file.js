const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const File = sequelize.define('File', {
    code: {
        type: DataTypes.TEXT,
    },
    path: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'files',
    timestamps: true
});

module.exports = File