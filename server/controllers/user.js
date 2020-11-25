const { userService } = require('../services')
const user = require('../services/user')

const getListUser = async (req, res, next) => {
    const rs = await userService.getListUser(null)
    res.send({
        data: rs
    })
}

const signup = async (req, res, next) => {
    try {
        const rs = await userService.signup(req.body)
        res.send({
            data: rs
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({message: error.message})
    }
}

const signin = async (req, res, next) => {
    try {
        const rs = await userService.signin(req.body)
        res.send({
            data: rs
        })
    } catch (error) {
        console.log(error)
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
        res.send({
            data: rs
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({message: error.message})
    }
}
const logout = async (req, res, next) => {
    try {
        
        const rs = await userService.logout(req.user)
        res.send({
            data: rs
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({message: error.message})
    }
}


module.exports = {
    getListUser,
    signup,
    signin,
    refreshToken,
    logout
}