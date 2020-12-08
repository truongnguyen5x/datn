const { VChain } = require('../models')

const getListVChain = async () => {
    return VChain.findAll({})
}

const getVChainById = async (id) => {
    return VChain.findOne({ where: { id } })
}

const createVChain = async (data) => {
    return VChain.create(data)
}

const updateVChain = async (data) => {
    return VChain.update(data, { where: { id: data.id } })
}

const deleteVChain = async (id) => {
    return VChain.destroy({ where: { id } })
}

module.exports = {
    getListVChain,
    getVChainById,
    createVChain,
    updateVChain,
    deleteVChain
}