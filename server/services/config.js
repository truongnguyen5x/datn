const { Config } = require("../models");


const getConfigByKey = async (key) => {
    return Config.findOne({
        where: {key}
    })
}

module.exports ={
    getConfigByKey
}