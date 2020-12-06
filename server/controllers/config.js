const { configService } = require('../services')
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")


const getConfigs = async (req, res, next) => {
    try {
        const rs = await configService.getListConfig()
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}


const getConfigByKey = async (req, res, next) => {
    try {
        const rs = await configService.getConfigByKey()
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}

const updateBatchConfig = async (req, res, next) => {
    try {
        const rs = await configService.updateBatchConfig(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    getConfigs,
    getConfigByKey,
    updateBatchConfig
}