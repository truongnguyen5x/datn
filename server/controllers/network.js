const {  networkService } = require('../services')

const { ResponseError, ResponseSuccess } = require("../middlewares/Response")

const getListNetwork = async (req, res, next) => {
    try {
        const rs = await networkService.getListNetwork()
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}



module.exports = {
    getListNetwork
}