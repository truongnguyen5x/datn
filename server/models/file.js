const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const File = sequelize.define('File', {
    path: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.TEXT,
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
    tableName: 'files'
});

module.exports = File