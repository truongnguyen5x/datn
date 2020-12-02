import { FetchApi } from '../axios'

export const getListTemplateToken = () => async dispatch => {
    FetchApi('/api/templateToken')
        .then(res => {
            dispatch({
                type: "GET_LIST_TEMPLATE_TOKEN",
                payload: res
            })
        })
        .catch(error => {
            console.log(error)
        })
}

export const updateTemplateToken = (data) => async dispatch => {
    const { id } = data
    FetchApi(`/api/templateToken/${id}`, 'PUT', data)
        .then(res => {


        })
        .catch(error => {
            console.log(error)
        })
}

export const createTemplateToken = (data) => async dispatch => {
    FetchApi(`/api/templateToken`, 'POST', data)
        .then(res => {

        })
        .catch(error => {
            console.log(error)
        })
}

export const deleteTemplateToken = (id) => async dispatch => {
    FetchApi(`/api/templateToken/${id}`, 'DELETE')
        .then(res => {

        })
        .catch(error => {
            console.log(error)
        })
}