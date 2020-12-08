
import { FetchApi } from "../axios"

export const getListToken = () => dispatch => {
    return FetchApi("/api/token-admin")
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

export const createToken = (data) => dispatch => {
    return FetchApi("/api/token-admin", 'POST', data)
}

export const deleteToken = (id) => dispatch => {
    return FetchApi(`/api/token-admin/${id}`, 'DELETE')
}