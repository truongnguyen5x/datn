const { User } = require('../models')

const getListUser = async (id) => {
    return User.findAll()
}

module.exports = {
    getListUser
}