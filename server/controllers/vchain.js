const { vchainService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")

const getListVChain = async (req, res, next) => {
    try {
        const rs = await vchainService.getListVChain()
        ResponseSuccess(res, rs)
    } catch (error) {
        console.log(error)
        ResponseError(res, error, "ERROR")
    }
}

const getVChainById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await vchainService.getVChainById(id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createVChain = async (req, res, next) => {
    try {
        const rs = await vchainService.createVChain(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const updateVChain = async (req, res, next) => {
    try {
        const { id } = req.params
        const vchain = await vchainService.getVChainById(id)
        if (!vchain) {
            throw new ApiError('khong tim thay template')
        }
        req.body.id = id
        const rs = await vchainService.updateVChain(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const deleteVChain = async (req, res, next) => {
    try {
        const { id } = req.params
        const vchain = await vchainService.getVChainById(id)
        if (!vchain) {
            throw new ApiError('khong tim thay template')
        }
        await vchainService.deleteVChain(id)
        ResponseSuccess(res)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


module.exports = {
    createVChain,
    getListVChain,
    getVChainById,
    updateVChain,
    deleteVChain
}