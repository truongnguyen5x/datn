
import { FetchApi } from "../axios"

export const getListVCoin = () => dispatch => {
    return FetchApi("/api/vcoin")
}

export const updateConfig  = (data) => dispatch => {
    return FetchApi(`/api/config`, 'post', data)
}

export const updateVCoin = (data) => dispatch => {
    return FetchApi(`/api/vcoin`, 'put', data)
}

export const exportSDK = (id) => dispatch => {
    return FetchApi(`/api/vcoin/sdk/${id}`, "POST")
}




