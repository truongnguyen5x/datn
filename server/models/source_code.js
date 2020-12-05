const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const SourceCode = sequelize.define('SourceCode', {
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    }
}, {
    tableName: 'source_codes'
});

module.exports = SourceCode