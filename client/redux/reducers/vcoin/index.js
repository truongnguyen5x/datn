const initialState = {
    listVCoin: []
}
const vcoin = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LIST_VCHAIN": {
            return { ...state, listVCoin: action.payload }
        }
        default: {
            return state
        }
    }
}


export default vcoin