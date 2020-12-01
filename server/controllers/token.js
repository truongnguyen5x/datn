const { tokenService } = require('../services')

const getListToken = async (req, res, next) => {
    try {
        const rs = await tokenService.getListToken()
        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}

const getTokenById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await tokenService.getTokenById(id)
        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}

const createToken = async (req, res, next) => {
    try {
        const rs = await tokenService.createToken(req.body)
        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}

const updateToken = async (req, res, next) => {
    try {
        const { id } = req.params
        const token = await tokenService.getTokenById(id)
        if (!token) {
            throw new Error("Khong tim thay token ")
        }
        req.body.id = id
        const rs = await tokenService.updateToken(req.body)
        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}

const deleteToken = async (req, res, next) => {
    try {
        const { id } = req.params
        const token = await tokenService.getTokenById(id)
        if (!token) {
            throw new Error("Khong tim thay token ")
        }
        await tokenService.deleteToken(id)
        res.send({ message: 'success' })
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}


module.exports = {
    createToken,
    getListToken,
    getTokenById,
    updateToken,
    deleteToken
}