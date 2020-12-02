import { FetchApi } from '../axios'

export const getListTemplateToken = () => async dispatch => {
    return FetchApi('/api/templateToken')
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_TEMPLATE_TOKEN",
                    payload: res.data
                })
            } else {
                return res
            }
        })
}

export const updateTemplateToken = (data) => async dispatch => {
    const { id } = data
    return FetchApi(`/api/templateToken/${id}`, 'PUT', data)

}

export const createTemplateToken = (data) => async dispatch => {
    return FetchApi(`/api/templateToken`, 'POST', data)
}

export const deleteTemplateToken = (id) => async dispatch => {
    return FetchApi(`/api/templateToken/${id}`, 'DELETE')
}