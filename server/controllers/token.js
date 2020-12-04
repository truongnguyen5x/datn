const { tokenService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")


const getListToken = async (req, res, next) => {
    try {
        const rs = await tokenService.getListToken()
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const getTokenById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await tokenService.getTokenById(id)
        ResponseSuccess(res, rs)
    } catch  (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createToken = async (req, res, next) => {
    try {
        const rs = await tokenService.createToken(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
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
        const token = await tokenService.getTokenById(id)
        if (!token) {
            throw new ApiError("Khong tim thay token ")
        }
        await tokenService.deleteToken(token)
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
    deleteToken
}