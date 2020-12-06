const { accountService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")

const getListAccount = async (req, res, next) => {
    try {
        const { user } = req
        const rs = await accountService.getListAccount(user.id)
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}

const getAccountById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await accountService.getAccountById(id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createAccount = async (req, res, next) => {
    try {
        const { user } = req
        const rs = await accountService.createAccount(req.body, user.id)
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}

const updateAccount = async (req, res, next) => {
    try {
        const { id } = req.params
        const account = await accountService.getAccountById(id)
        if (!account) {
            throw new ApiError('khong tim thay template')
        }
        req.body.id = id
        const rs = await accountService.updateAccount(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const deleteAccount = async (req, res, next) => {
    try {
        const { id } = req.params
        const account = await accountService.getAccountById(id)
        if (!account) {
            throw new ApiError('khong tim thay template')
        }
        await accountService.deleteAccount(id)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    createAccount,
    getListAccount,
    getAccountById,
    updateAccount,
    deleteAccount
}