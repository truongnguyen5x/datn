const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const TemplateDapp = sequelize.define('TemplateDapp', {
    name: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'template_dapps'
});

module.exports = TemplateDapp