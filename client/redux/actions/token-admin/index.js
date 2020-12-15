
import { FetchApi } from "../axios"

export const getListToken = () => (dispatch, getState) => {
    const type = getState().tokenAdmin.listType
    return FetchApi(`/api/token-admin`, "GET", { type })
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
    return FetchApi("/api/token-admin", 'GET', { type })
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_TOKEN",
                    payload: res.data
                })
            }
        })
}


export const deleteToken = (id) => dispatch => {
    return FetchApi(`/api/token-admin/${id}`, 'DELETE')
}

export const getTokenById = (id) => (dispatch, getState) => {
    const type = getState().tokenAdmin.listType
    return FetchApi(`/api/token-admin/${id}`, 'GET', { type })
}

export const acceptRequest = (data) => dispatch => {
    return FetchApi(`/api/token-admin/accept`, 'POST', data)
}
export const denyRequest = (data) => dispatch => {
    return FetchApi(`/api/token-admin/deny`, 'POST', data)
}
