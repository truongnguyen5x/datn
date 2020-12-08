const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const TemplateToken = sequelize.define('TemplateToken', {
    description: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
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
    tableName: 'template_tokens'
});

module.exports = TemplateToken