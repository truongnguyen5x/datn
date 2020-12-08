const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const File = sequelize.define('File', {
    code: {
        type: DataTypes.TEXT,
    },
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
    tableName: 'files'
});

module.exports = File