const { tokenService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")
const { sequelize } = require("../configs")

const getListToken = async (req, res, next) => {
    try {
        const {user} = req
        const {type} = req.query
        let rs
        if (user.role == 0) {
            rs = await tokenService.getListToken(type)
        } else {
            rs = await tokenService.getListPersonalToken(user.id, type)
        }
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}

const getTokenById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await tokenService.getTokenById(id, req.query)
        ResponseSuccess(res, rs)
    } catch  (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}

const createToken = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { user } = req
        const rs = await tokenService.createToken(req.body, user.id, t)
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        await t.rollback();
        ResponseError(res, error, "ERROR")
    }
}

const updateToken = async (req, res, next) => {
    try {
        const { id } = req.params
        const token = await tokenService.getTokenById(id)
        if (!token) {
            throw new ApiError("Khong tim thay token ")
        }
        req.body.id = id
        const rs = await tokenService.updateToken(req.body, token)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const deleteToken = async (req, res, next) => {
    try {
        const { id } = req.params
        await tokenService.deleteToken(id)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const validateSource = async (req, res, next) => {
    try {
        const rs = await tokenService.validateSource(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


const createRequest = async (req, res, next) => {
    try {
        const rs = await tokenService.createRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}
const cancelRequest = async (req, res, next) => {
    try {
        const rs = await tokenService.cancelRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}
const acceptRequest = async (req, res, next) => {
    try {
        const rs = await tokenService.acceptRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}

const denyRequest = async (req, res, next) => {
    try {
        const rs = await tokenService.denyRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}
const testContract = async (req, res, next) => {
    try {
        await tokenService.testContract(req.body)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const exportSDK = async (req, res, next) => {
    try {
        await tokenService.exportSDK(req.body)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    createToken,
    getListToken,
    getTokenById,
    updateToken,
    deleteToken,
    validateSource,
    createRequest,
    cancelRequest,
    acceptRequest,
    denyRequest,
    testContract,
    exportSDK
}