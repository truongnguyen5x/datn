const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs')

const Network = sequelize.define('Network', {
    chain_id: {
        type: DataTypes.STRING,
    },
    net_id: {
        type: DataTypes.INTEGER
    },
    path: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'networks',
    timestamps: true
});

module.exports = Network