const initialState = {
    listVCoin: [],
    filter: "used",
    vcoin: null
}
const vcoin = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LIST_VCOIN": {
            return { ...state, listVCoin: action.payload }
        }
        case "CHANGE_FILTER_VCOIN": {
            return {...state, filter: action.payload}
        }
        case "GET_DETAIL_VCOIN": {
            return {...state, vcoin: action.payload}
        }
        default: {
            return state
        }
    }
}


export default vcoin