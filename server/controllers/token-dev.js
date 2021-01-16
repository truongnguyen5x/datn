const { tokenDevService } = require('../services')
const ApiError = require("../middlewares/error")
const { ResponseError, ResponseSuccess } = require("../middlewares/Response")
var multer = require('multer');
const path = require('path')

const getListToken = async (req, res, next) => {
    try {
        const { user } = req
        const { type } = req.query
        let rs = await tokenDevService.getListToken(user.id, type)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const getTokenById = async (req, res, next) => {
    try {
        const { id } = req.params
        const { type } = req.query
        const rs = await tokenDevService.getTokenById(id, type)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const createToken = async (req, res, next) => {
    try {
        const { user } = req
        const rs = await tokenDevService.createToken(req.body, user.id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


const validateSource = async (req, res, next) => {
    try {
        const rs = await tokenDevService.validateSource(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


const createRequest = async (req, res, next) => {
    try {
        const rs = await tokenDevService.createRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const cancelRequest = async (req, res, next) => {
    try {
        const rs = await tokenDevService.cancelRequest(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}


const testDeploy = async (req, res, next) => {
    try {
        const { user } = req
        const rs = await tokenDevService.testDeploy(req.body, user.id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

const checkTokenSymbol = async (req, res, next) => {
    try {
        const { symbol } = req.query
        const { user } = req
        const rs = await tokenDevService.checkTokenSymbol(symbol, user.id)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}



var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        // console.log('11111111111')
        let url = path.join(__dirname, '../../content/uploads');
        cb(null, url);
    },
    filename: function (req, file, cb) {
        // console.log('22222222222222')
        let date = Date.now()
        let name = date + '-' + decodeURI(file.originalname.normalize())
        file.fileName = '/uploads/' + name
        cb(null, name);
    }
});
var uploadFile = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },//200Mb
    fileFilter: function (req, file, cb) {
        cb(null, true);
    }
});

const upload = async (req, res, next) => {
    uploadFile.single('image')(req, res, async function (err) {
        if (err) {
            // console.log(err)
            ResponseError(res, err, "ERROR")
            return
        }
        try {
            const { body, file } = req
            const { fileName } = file
            ResponseSuccess(res, fileName)
        } catch (error) {
            ResponseError(res, error, "ERROR")
        }
    });
}

const updateToken = async (req, res, next) => {
    try {
        const rs = await tokenDevService.updateToken(req.body)
        ResponseSuccess(res, rs)
    } catch (error) {
        ResponseError(res, error, "ERROR")
    }
}

module.exports = {
    createToken,
    getListToken,
    getTokenById,
    validateSource,
    createRequest,
    cancelRequest,
    testDeploy,
    checkTokenSymbol,
    upload,
    updateToken
}