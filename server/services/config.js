const { Config } = require("../models");


const getConfigByKey = async (key) => {
    return Config.findOne({
        where: { key }
    })
}

const updateBatchConfig = async (data) => {
    const p_w = data.map(async i => {
        console.log(i)
        const config = await Config.findOne({
            where: { key: i.key }
        })
        if (config) {
            return config.update(i)
        } else {
            return Config.create(i)
        }
    })
    return Promise.all(p_w)
}

const initConfig = async () => {
    return Config.bulkCreate([
        { key: "VCOIN_ADDRESS", value: "" },
        { key: "VCOIN_OWNER", value: "" },
        { key: "CURRENT_NETWORK", value: "" }
    ])
}

const getListConfig = async () => {
    return Config.findAll({})
}

module.exports = {
    getConfigByKey,
    updateBatchConfig,
    getListConfig,
    initConfig
}