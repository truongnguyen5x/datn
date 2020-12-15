const { tokenAdminService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")
const { sequelize } = require("../configs")

const getListToken = async (req, res, next) => {
    try {
        const { type } = req.query
        let rs = await tokenAdminService.getListToken(type)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const getTokenById = async (req, res, next) => {
    try {
        const { id } = req.params
        const { type } = req.query
        const rs = await tokenAdminService.getTokenById(id, type)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const deleteToken = async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {
        const { id } = req.params
        await tokenAdminService.deleteToken(id, transaction)
        await transaction.commit()
        ResponseSuccess(res)
    } catch (error) {
        await transaction.rollback()
        ResponseError(res, error, "ERROR")
    }
}



const acceptRequest = async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {
        const rs = await tokenAdminService.acceptRequest(req.body, transaction)
        await transaction.commit()
        ResponseSuccess(res, rs)
    } catch (error) {
        await transaction.rollback()
        ResponseError(res, error, "ERROR")
    }
}

const denyRequest = async (req, res, next) => {
    try {
        const rs = await tokenAdminService.denyRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}



module.exports = {
    getListToken,
    getTokenById,
    deleteToken,
    acceptRequest,
    denyRequest,
}