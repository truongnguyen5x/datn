const initialState = {
    listVChain: []
}
const vchain = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LIST_VCHAIN": {
            return { ...state, listVChain: action.payload }
        }
        default: {
            return state
        }
    }
}


export default vchain