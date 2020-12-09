
import { FetchApi } from "../axios"

export const getListVCoin = (filter) => dispatch => {
    dispatch({
        type: "CHANGE_FILTER_VCOIN",
        payload: filter
    })
    return FetchApi("/api/vcoin", 'get', { filter })
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




