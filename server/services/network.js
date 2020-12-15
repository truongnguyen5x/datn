const { Network } = require('../models')

const getListNetwork = async () => {
    return Network.findAll()
}
const getNetWorkById = async (id) => {
    return Network.findOne({ where: { id } })
}

module.exports = {
    getListNetwork,
    getNetWorkById
}