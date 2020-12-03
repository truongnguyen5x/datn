const { dappService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")

const getListDapp = async (req, res, next) => {
    try {
        const rs = await dappService.getListDapp()
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const getDappById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await dappService.getDappById(id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createDapp = async (req, res, next) => {
    try {
        const rs = await dappService.createDapp(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const updateDapp = async (req, res, next) => {
    try {
        const { id } = req.params
        const dapp = await dappService.getDappById(id)
        if (!dapp) {
            throw new ApiError('khong tim thay dapp')
        }
        req.body.id = id
        const rs = await dappService.updateDapp(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const deleteDapp = async (req, res, next) => {
    try {
        const { id } = req.params
        const dapp = await dappService.getDappById(id)
        if (!dapp) {
            throw new ApiError('khong tim thay dapp')
        }
        await dappService.deleteDapp(id)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    createDapp,
    getListDapp,
    getDappById,
    updateDapp,
    deleteDapp
}