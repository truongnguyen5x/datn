const initialState = {
    loading: false,
}
const home = (state = initialState, action) => {
    switch (action.type) {
        case "SET_LOADING": {
            return { ...state, loading: action.payload }
        }
        default: {
            return state
        }
    }
}

export default home