import axios from 'axios'

export const getListTemplateToken = () => async dispatch => {
    const accessToken = localStorage.getItem('accessToken')
    axios.get('/api/templateToken', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => {

            dispatch({
                type: "GET_LIST_TEMPLATE_TOKEN",
                payload: res.data
            })
        })
        .catch(error => {
            console.log(error)
        })
}

export const updateTemplateToken = (data) => async dispatch => {
    const accessToken = localStorage.getItem('accessToken')
    const { id } = data
    axios.put(`/api/templateToken/${id}`, data, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => {
            

        })
        .catch(error => {
            console.log(error)
        })
}

export const createTemplateToken = (data) => async dispatch => {
    const accessToken = localStorage.getItem('accessToken')
    axios.post(`/api/templateToken`, data, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => {
            
        })
        .catch(error => {
            console.log(error)
        })
}

export const deleteTemplateToken = (id) => async dispatch => {
    const accessToken = localStorage.getItem('accessToken')
    axios.delete(`/api/templateToken/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(res => {
            
        })
        .catch(error => {
            console.log(error)
        })
}