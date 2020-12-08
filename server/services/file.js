const { File } = require('../models')



const getFileById = async (id) => {
    return File.findOne({ where: { id } })
}

module.exports = {
    getFileById
}