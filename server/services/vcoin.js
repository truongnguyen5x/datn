const { VCoin } = require('../models')

const getListVCoin = async () => {
    return VCoin.findAll({})
}

const getVCoinById = async (id) => {
    return VCoin.findOne({ where: { id } })
}

const createVCoin = async (data) => {
    return VCoin.create(data)
}

const updateVCoin = async (data) => {
    return VCoin.update(data, { where: { id: data.id } })
}

const deleteVCoin = async (id) => {
    return VCoin.destroy({ where: { id } })
}

module.exports = {
    getListVCoin,
    getVCoinById,
    createVCoin,
    updateVCoin,
    deleteVCoin
}