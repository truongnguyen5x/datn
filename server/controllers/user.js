const {userService} = require('../services')

const getListUser = async(req, res, next) => {
    const rs = await userService.getListUser(null)
    res.send({
        rs
    })
}


module.exports = {
    getListUser
}