import { FetchApi } from '../axios'

export const getListToken = () => async dispatch => {
    return FetchApi('/api/token')
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_TOKEN",
                    payload: res.data || []
                })
                return res.data || []
            } else {
                return res
            }
        })
}

export const updateToken = (data) => async dispatch => {
    const { id } = data
    return FetchApi(`/api/token/${id}`, 'PUT', data)
}

export const createToken = (data) => async dispatch => {
    return await FetchApi(`/api/token`, 'POST', data)
}

export const deleteToken = (id) => async dispatch => {
    return FetchApi(`/api/token/${id}`, 'DELETE')
}