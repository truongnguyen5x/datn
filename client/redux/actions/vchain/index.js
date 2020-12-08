
import { FetchApi } from "../axios"

export const getListVChain = () => dispatch => {
    return FetchApi("/api/vchain")
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

export const createVChain = (data) => dispatch => {
    return FetchApi("/api/vchain", 'POST', data)
}

export const deleteVChain = (id) => dispatch => {
    return FetchApi(`/api/vchain/${id}`, 'DELETE')
}