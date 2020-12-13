import axios from 'axios'
import { history } from "../../history"


export const FetchApi = async (url, method = 'get', body, headers) => {
    let token = localStorage.getItem("accessToken");
    try {
        let opts = {
            method,
            url: `${process.env.REACT_APP_API}${url}`,
            timeout: 1 * 1000 * 60,//1phut
            headers: { Authorization: `Bearer ${token}` }
        }
        if (method === 'get') {
            opts.params = body;
        } else {
            opts.data = body;
        }
        let fetchdata = await axios(opts);
        return fetchdata.data;
    } catch (error) {
        let { response } = error;
        if (response) {
            if (response.status == 401) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                console.log('from fetch api')
                history.push("/pages/login")
            }
            return response.data;
        }
        return error.message;
    }
};
