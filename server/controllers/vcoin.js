const { vcoinService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")
const { sequelize } = require("../configs")

const getListVCoin = async (req, res, next) => {
    try {
        const rs = await vcoinService.getListVCoin()
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const getVCoinById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await vcoinService.getVCoinById(id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createVCoin = async (req, res, next) => {
    try {
        const rs = await vcoinService.createVCoin(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const updateVCoin = async (req, res, next) => {
    try {
        const rs = await vcoinService.updateVCoin(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const deleteVCoin = async (req, res, next) => {
    try {
        const { id } = req.params
        const vcoin = await vcoinService.getVCoinById(id)
        if (!vcoin) {
            throw new ApiError('khong tim thay template')
        }
        await vcoinService.deleteVCoin(id)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}
const testDeploy = async (req, res, next) => {
    try {
        const { user } = req
        const rs = await vcoinService.testDeploy(req.body, user.id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    createVCoin,
    getListVCoin,
    getVCoinById,
    updateVCoin,
    deleteVCoin,
    testDeploy
}