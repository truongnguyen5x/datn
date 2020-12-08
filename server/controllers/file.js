const { fileService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")


const getFileById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await fileService.getFileById(id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    getFileById
}