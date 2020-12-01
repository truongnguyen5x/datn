const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const TemplateToken = sequelize.define('TemplateToken', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
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
    tableName: 'templates'
});

module.exports = TemplateToken