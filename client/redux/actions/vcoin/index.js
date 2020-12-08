
import { FetchApi } from "../axios"

export const getListVCoin = () => dispatch => {
    return FetchApi("/api/vcoin")
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

export const createVCoin = (data) => dispatch => {
    return FetchApi("/api/vcoin", 'POST', data)
}

export const deleteVCoin = (id) => dispatch => {
    return FetchApi(`/api/vcoin/${id}`, 'DELETE')
}