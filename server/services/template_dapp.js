const { TemplateDapp } = require('../models')

const getListTemplateDapp = async () => {
    return TemplateDapp.findAll({})
}

const getTemplateDappById = async (id) => {
    return TemplateDapp.findOne({ id })
}

const createTemplateDapp = async (data) => {
    return TemplateDapp.create(data)
}

const updateTemplateDapp = async (data) => {
    return TemplateDapp.update(data, { where: { id: data.id } })
}

const deleteTemplateDapp = async (id) => {
    return TemplateDapp.destroy({ where: { id } })
}

module.exports = {
    getListTemplateDapp,
    getTemplateDappById,
    createTemplateDapp,
    updateTemplateDapp,
    deleteTemplateDapp
}