const { Dapp } = require('../models')

const getListDapp = async () => {
    return Dapp.findAll({})
}

const getDappById = async (id) => {
    return Dapp.findOne({ id })
}

const createDapp = async (data) => {
    return Dapp.create(data)
}

const updateDapp = async (data) => {
    return Dapp.update(data, { where: { id: data.id } })
}

const deleteDapp = async (id) => {
    return Dapp.destroy({ where: { id } })
}

module.exports = {
    getListDapp,
    getDappById,
    createDapp,
    updateDapp,
    deleteDapp
}