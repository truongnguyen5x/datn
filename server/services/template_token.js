const { TemplateToken } = require('../models')

const getListTemplateToken = async () => {
    return TemplateToken.findAll({})
}

const getTemplateTokenById = async (id) => {
    return TemplateToken.findOne({ where: { id } })
}

const createTemplateToken = async (data) => {
    return TemplateToken.create(data)
}

const updateTemplateToken = async (data) => {
    return TemplateToken.update(data, { where: { id: data.id } })
}

const deleteTemplateToken = async (id) => {
    return TemplateToken.destroy({ where: { id } })
}

module.exports = {
    getListTemplateToken,
    getTemplateTokenById,
    createTemplateToken,
    updateTemplateToken,
    deleteTemplateToken
}