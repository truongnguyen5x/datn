const initialState = {
    listVCoin: [],
    filter: "used"
}
const vcoin = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LIST_VCHAIN": {
            return { ...state, listVCoin: action.payload }
        }
        case "CHANGE_FILTER_VCOIN": {
            return {...state, filter: action.payload}
        }
        default: {
            return state
        }
    }
}


export default vcoin