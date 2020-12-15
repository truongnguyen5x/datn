
import { FetchApi } from "../axios"

export const getListToken = () => (dispatch, getState) => {
    const type = getState().tokenDev.listType
    return FetchApi(`/api/token-dev`, "GET", { type })
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_TOKEN",
                    payload: res.data
                })

                return res.data
            } else {
                return res
            }
        })
}


export const changeFilter = (type) => dispatch => {
    dispatch({
        type: "CHANGE_LIST_TYPE_TOKEN",
        payload: type
    })
    return FetchApi("/api/token-dev", 'GET', { type })
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_TOKEN",
                    payload: res.data
                })
            }
        })
}

export const createToken = (data) => dispatch => {
    return FetchApi("/api/token-dev", 'POST', data)
}

export const validateSource = (data) => dispatch => {
    return FetchApi(`/api/token-dev/validate`, "POST", data)
}

export const getTokenById = (id) => (dispatch, getState) => {
    const type = getState().tokenDev.listType
    return FetchApi(`/api/token-dev/${id}`, "GET", { type })
}

export const createRequest = (data) => dispatch => {
    return FetchApi(`/api/token-dev/request`, 'post', data)
}
export const cancelRequest = (data) => dispatch => {
    return FetchApi(`/api/token-dev/request`, 'delete', data)
}

export const getConfig = (key) => dispatch => {
    return FetchApi(`/api/config/${key}`)
}

export const exportSDK = (id) => dispatch => {
    return FetchApi(`/api/token-dev/sdk/${id}`, 'post')
}