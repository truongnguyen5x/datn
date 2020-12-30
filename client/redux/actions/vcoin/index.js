
import { FetchApi } from "../axios"

export const getListVCoin = () => dispatch => {
    return FetchApi("/api/vcoin").then(res => {
        dispatch({
            type: 'GET_LIST_VCOIN',
            payload: res.data
        })
        return res
    })
}

export const updateConfig  = (data) => dispatch => {
    return FetchApi(`/api/config`, 'post', data)
}

export const updateVCoin = (data) => dispatch => {
    return FetchApi(`/api/vcoin`, 'put', data)
}

export const createVcoin = (data) => dispatch => {
    return FetchApi(`/api/vcoin`, 'post', data)
}

export const testDeploy = (data) => dispatch => {
    return FetchApi(`/api/vcoin/testDeploy`, 'post', data)
}