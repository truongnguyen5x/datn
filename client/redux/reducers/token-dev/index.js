const initialState = {
    listToken: [],
    listType: "all",
    modalOpen: "",
}
const token = (state = initialState, action) => {
    switch (action.type) {
        case "GET_LIST_TOKEN": {
            return { ...state, listToken: action.payload }
        }
        case "CHANGE_LIST_TYPE_TOKEN": {
            return { ...state, listType: action.payload }
        }
        case 'SET_MODAL_OPEN': {
            return { ...state, modalOpen: action.payload }
        }
        default: {
            return state
        }
    }
}


export default token