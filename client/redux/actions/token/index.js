
import { FetchApi } from "../axios"

export const getListToken = () => (dispatch, getState) => {
    const type = getState().token.listType
    return FetchApi(`/api/token`, "get", { type })
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

export const getListTokenAdmin = () => (dispatch, getState) => {
    const type = getState().token.listTypeAdmin
    return FetchApi(`/api/token`, "get", { type })
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
    return FetchApi("/api/token", 'get', { type })
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_TOKEN",
                    payload: res.data
                })
            }
        })
}
export const changeFilterAdmin = (type) => dispatch => {
    dispatch({
        type: "CHANGE_LIST_TYPE_TOKEN_ADMIN",
        payload: type
    })
    return FetchApi("/api/token", 'get', { type })
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
    return FetchApi("/api/token", 'POST', data)
}

export const deleteToken = (id) => dispatch => {
    return FetchApi(`/api/token/${id}`, 'DELETE')
}

export const getFileById = (id) => dispatch => {
    return FetchApi(`/api/file/${id}`)
}

export const validateSource = (data) => dispatch => {
    return FetchApi(`/api/token/validate`, "POST", data)
}

export const getTokenById = (data) => dispatch => {
    return FetchApi(`/api/token/${data.id}?type=${data.type}`)
}

export const createRequest = (data) => dispatch => {
    return FetchApi(`/api/token/request`, 'post', data)
}
export const cancelRequest = (data) => dispatch => {
    return FetchApi(`/api/token/request`, 'delete', data)
}

export const acceptRequest = (data) => dispatch => {
    return FetchApi(`/api/token/accept`, 'post', data)
}
export const denyRequest = (data) => dispatch => {
    return FetchApi(`/api/token/deny`, 'post', data)
}
export const getConfig = (key) => dispatch => {
    return FetchApi(`/api/config/${key}`)
}

export const exportSDK = (data) => dispatch => {
    return FetchApi(`/api/token/sdk`, 'post', data)
}