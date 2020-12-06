const initialState = {
    listAccount: []
}
const account = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LIST_ACCOUNT": {
            return { ...state, listAccount: action.payload }
        }
        default: {
            return state
        }
    }
}


export default account