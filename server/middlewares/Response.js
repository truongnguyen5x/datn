const ApiError = require('./error')
const ResponseSuccess = (res, data) => {
    res.status(200)
        .send({
            code: 200,
            data 
        })
}

const ResponseError = (res, error, errorCode) => {
    if (error instanceof ApiError) {
        res.status(400).send(error.errorCode)
    } else {
        res.status(400).send(errorCode)
    }
}

module.exports = {
    ResponseError,
    ResponseSuccess
}