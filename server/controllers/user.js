const { userService } = require('../services')
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")

const getListUser = async (req, res, next) => {
    try {
        const rs = await userService.getListUser(null)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const signup = async (req, res, next) => {
    try {
        const rs = await userService.signup(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const signin = async (req, res, next) => {
    try {
        const rs = await userService.signin(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const token  = req.header('Authorization').replace('Bearer ', '')
        if (!token) {
            throw new Error('Khong tim thay token')
        }
        const rs = await userService.refreshToken(token, req.body.refreshToken)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}
const logout = async (req, res, next) => {
    try {
        
        const rs = await userService.logout(req.user)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const me = async (req, res, next) => {
    try {
        const token  = req.header('Authorization').replace('Bearer ', '')
        if (!token) {
            throw new Error('Khong tim thay token')
        }
        const rs = await userService.me(token, req.body.refreshToken)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

module.exports = {
    getListUser,
    signup,
    signin,
    refreshToken,
    logout,
    me
}