const { templateTokenService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")

const getListTemplateToken = async (req, res, next) => {
    try {
        const rs = await templateTokenService.getListTemplateToken()
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const getTemplateTokenById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await templateTokenService.getTemplateTokenById(id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createTemplateToken = async (req, res, next) => {
    try {
        const rs = await templateTokenService.createTemplateToken(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const updateTemplateToken = async (req, res, next) => {
    try {
        const { id } = req.params
        const templateToken = await templateTokenService.getTemplateTokenById(id)
        if (!templateToken) {
            throw new ApiError('khong tim thay template')
        }
        req.body.id = id
        const rs = await templateTokenService.updateTemplateToken(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const deleteTemplateToken = async (req, res, next) => {
    try {
        const { id } = req.params
        const templateToken = await templateTokenService.getTemplateTokenById(id)
        if (!templateToken) {
            throw new ApiError('khong tim thay template')
        }
        await templateTokenService.deleteTemplateToken(id)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    createTemplateToken,
    getListTemplateToken,
    getTemplateTokenById,
    updateTemplateToken,
    deleteTemplateToken
}