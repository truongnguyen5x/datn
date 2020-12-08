const { File } = require('../models')



const getFileById = async (id) => {
    return File.findOne({ where: { id } })
}

const bulkCreate = async (data) => {
    return File.bulkCreate(data)
}

module.exports = {
    getFileById,
    bulkCreate
}