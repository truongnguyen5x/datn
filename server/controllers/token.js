const { tokenService } = require('../services')


const createToken = async (req, res, next) => {
    try {
        await tokenService.createToken()
        res.send('success')
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error.message })
    }
}

module.exports = {
    createToken
}