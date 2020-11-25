const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    // first_name: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    // last_name: {
    //     type: DataTypes.STRING
    //     // allowNull defaults to true
    // },
    private_key: {
        type: DataTypes.BLOB
    }
}, {
    tableName: 'users'
});

module.exports = User