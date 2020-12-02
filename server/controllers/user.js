const { userService } = require('../services')


const getListUser = async (req, res, next) => {
    const rs = await userService.getListUser(null)
    res.send(rs)
}

const signup = async (req, res, next) => {
    try {
        const rs = await userService.signup(req.body)
        res.send(rs)
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const signin = async (req, res, next) => {
    try {
        const rs = await userService.signin(req.body)
        res.send(rs)
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}
const refreshToken = async (req, res, next) => {
    try {
        const token  = req.header('Authorization').replace('Bearer ', '')
        if (!token) {
            throw new Error('Khong tim thay token')
        }
        const rs = await userService.refreshToken(token, req.body.refreshToken)
        res.send(rs)
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}
const logout = async (req, res, next) => {
    try {
        
        const rs = await userService.logout(req.user)
        res.send(rs)
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const me = async (req, res, next) => {
    try {
        const token  = req.header('Authorization').replace('Bearer ', '')
        if (!token) {
            throw new Error('Khong tim thay token')
        }
        const rs = await userService.me(token, req.body.refreshToken)
        res.send(rs)
    } catch (error) {
        res.status(400).send({message: error.message})
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