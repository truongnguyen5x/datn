import axios from 'axios'

export const FetchApi = async (url, method = 'get', body, headers) => {
    let token = localStorage.getItem("accessToken");
    try {
        let opts = {
            method,
            url: `${url}`,
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
            return response.data;
        }
        return error;
    }
};
