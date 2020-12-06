
import { FetchApi } from "../axios"

export const getListAccount = () => dispatch => {
    return FetchApi("/api/account")
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_ACCOUNT",
                    payload: res.data
                })
                return res.data
            } else {
                return res
            }
        })
}

export const createAccount = (data) => dispatch => {
    return FetchApi("/api/account", 'POST', data)
}

export const deleteAccount = (id) => dispatch => {
    return FetchApi(`/api/account/${id}`, 'DELETE')
}