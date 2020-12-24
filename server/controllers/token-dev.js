const { tokenDevService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")
const { sequelize } = require("../configs")

const getListToken = async (req, res, next) => {
    try {
        const { user } = req
        const { type } = req.query
        let rs = await tokenDevService.getListToken(user.id, type)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const getTokenById = async (req, res, next) => {
    try {
        const { id } = req.params
        const { type } = req.query
        const rs = await tokenDevService.getTokenById(id, type)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createToken = async (req, res, next) => {
    try {
        const { user } = req
        const rs = await tokenDevService.createToken(req.body, user.id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


const validateSource = async (req, res, next) => {
    try {
        const rs = await tokenDevService.validateSource(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


const createRequest = async (req, res, next) => {
    try {
        const rs = await tokenDevService.createRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const cancelRequest = async (req, res, next) => {
    try {
        const rs = await tokenDevService.cancelRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


const testDeploy = async (req, res, next) => {
    try {
        const { user } = req
        const rs = await tokenDevService.testDeploy(req.body, user.id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    createToken,
    getListToken,
    getTokenById,
    validateSource,
    createRequest,
    cancelRequest,
    testDeploy
}