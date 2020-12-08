const initialState = {
    listToken: []
}
const token = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LIST_TOKEN": {
            return { ...state, listToken: action.payload }
        }
        default: {
            return state
        }
    }
}


export default token