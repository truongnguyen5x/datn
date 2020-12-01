const { templateTokenService } = require('../services')


const getListTemplateToken = async (req, res, next) => {
    try {
        const rs = await templateTokenService.getListTemplateToken()
        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}
const getTemplateTokenById = async (req, res, next) => {
    try {
        const { id } = req.params
        const rs = await templateTokenService.getTemplateTokenById(id)
        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}
const createTemplateToken = async (req, res, next) => {
    try {
        const rs = await templateTokenService.createTemplateToken(req.body)
        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}
const updateTemplateToken = async (req, res, next) => {
    try {
        const { id } = req.params
        const templateToken = await templateTokenService.getTemplateTokenById(id)
        if (!templateToken) {
            throw new Error('khong tim thay template')
        }
        req.body.id = id
        const rs = await templateTokenService.updateTemplateToken(req.body)
        res.send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}
const deleteTemplateToken = async (req, res, next) => {
    try {
        const { id } = req.params
        const templateToken = await templateTokenService.getTemplateTokenById(id)
        if (!templateToken) {
            throw new Error('khong tim thay template')
        }
        await templateTokenService.deleteTemplateToken(id)
        res.send({ message: 'success' })
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}


module.exports = {
    createTemplateToken,
    getListTemplateToken,
    getTemplateTokenById,
    updateTemplateToken,
    deleteTemplateToken
}