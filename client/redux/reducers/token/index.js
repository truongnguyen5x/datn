const initState = {
    listToken: []
  }
  
  const reducer = (state = initState, action) => {
    switch (action.type) {
      case "GET_LIST_TOKEN": {
        return { ...state, listToken: action.payload }
      }
      default: {
        return state
      }
    }
  }
  export default reducer