import { FetchApi } from '../axios'

export const getListDapp = () => async dispatch => {
    return FetchApi('/api/dapp')
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_DAPP",
                    payload: res.data
                })
            } else {
                return res
            }
        })
}

export const updateDapp = (data) => async dispatch => {
    const { id } = data
    return FetchApi(`/api/dapp/${id}`, 'PUT', data)

}

export const createDapp = (data) => async dispatch => {
    return FetchApi(`/api/dapp`, 'POST', data)
}

export const deleteDapp = (id) => async dispatch => {
    return FetchApi(`/api/dapp/${id}`, 'DELETE')
}