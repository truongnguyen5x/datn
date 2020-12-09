const { vcoinService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")
const { sequelize } = require("../configs")

const getListVCoin = async (req, res, next) => {
    try {
        const { filter } = req.query
        const rs = await vcoinService.getListVCoin(filter)
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
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
    const t = await sequelize.transaction();
    try {
        const { user } = req
        const rs = await vcoinService.createVCoin(req.body, user.id, t)
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        await t.rollback();
        ResponseError(res, error, "ERROR")
    }
}

const updateVCoin = async (req, res, next) => {
    try {
        const { id } = req.params
        const vcoin = await vcoinService.getVCoinById(id)
        if (!vcoin) {
            throw new ApiError('khong tim thay template')
        }
        req.body.id = id
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


module.exports = {
    createVCoin,
    getListVCoin,
    getVCoinById,
    updateVCoin,
    deleteVCoin
}