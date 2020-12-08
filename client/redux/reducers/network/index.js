const initialState = {
    listNetwork: []
}
const account = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LIST_NETWORK": {
            return { ...state, listNetwork: action.payload }
        }
        default: {
            return state
        }
    }
}


export default account