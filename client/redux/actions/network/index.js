
import { FetchApi } from "../axios"

export const getListNetwork = () => dispatch => {
    return FetchApi("/api/network")
        .then(res => {
            if (res.code) {
                dispatch({
                    type: "GET_LIST_NETWORK",
                    payload: res.data
                })
                return res.data
            } else {
                return res
            }
        })
}
