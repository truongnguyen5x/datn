const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const TemplateToken = sequelize.define('TemplateToken', {
    name: {
        type: DataTypes.STRING
    },
    description: {
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