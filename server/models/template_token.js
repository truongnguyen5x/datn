const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const TemplateToken = sequelize.define('TemplateToken', {
    name: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'template_tokens'
});

module.exports = TemplateToken