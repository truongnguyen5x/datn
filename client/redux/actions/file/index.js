
import { FetchApi } from "../axios"


export const getFile = (id) => dispatch => {
    return FetchApi(`/api/file/${id}`)
}
