const {  networkService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")

const getListNetwork = async (req, res, next) => {
    try {
        const rs = await networkService.getListNetwork()
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}



module.exports = {
    getListNetwork
}