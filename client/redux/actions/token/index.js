import { FetchApi } from '../axios'

export const getListToken = () => async dispatch => {
    try {
        const res = await FetchApi('/api/token')
        dispatch({
            type: "GET_LIST_TOKEN",
            payload: res
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

export const updateToken = (data) => async dispatch => {
    const { id } = data
    FetchApi(`/api/token/${id}`, 'PUT', data)
        .then(res => {

        })
        .catch(error => {
            console.log(error)
        })
}

export const createToken = (data) => async dispatch => {
    try {
        const res = await FetchApi(`/api/token`, 'POST', data)
        return res
    } catch (error) {
        console.log(error)
    }
}

export const deleteToken = (id) => async dispatch => {
    FetchApi(`/api/token/${id}`, 'DELETE')
        .then(res => {

        })
        .catch(error => {
            console.log(error)
        })
}