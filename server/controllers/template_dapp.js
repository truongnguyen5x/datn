const { templateDappService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")

const getListTemplateDapp = async (req, res, next) => {
    try {
        const rs = await templateDappService.getListTemplateDapp()
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}

const getTemplateDappById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await templateDappService.getTemplateDappById(id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createTemplateDapp = async (req, res, next) => {
    try {
        const rs = await templateDappService.createTemplateDapp(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const updateTemplateDapp = async (req, res, next) => {
    try {
        const { id } = req.params
        const TemplateDapp = await templateDappService.getTemplateDappById(id)
        if (!TemplateDapp) {
            throw new ApiError('khong tim thay template')
        }
        req.body.id = id
        const rs = await templateDappService.updateTemplateDapp(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const deleteTemplateDapp = async (req, res, next) => {
    try {
        const { id } = req.params
        const TemplateDapp = await templateDappService.getTemplateDappById(id)
        if (!TemplateDapp) {
            throw new ApiError('khong tim thay template')
        }
        await templateDappService.deleteTemplateDapp(id)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    createTemplateDapp,
    getListTemplateDapp,
    getTemplateDappById,
    updateTemplateDapp,
    deleteTemplateDapp
}