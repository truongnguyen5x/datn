const initState = {
  listDapp: []
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_LIST_DAPP": {
      return { ...state, listDapp: action.payload }
    }
    default: {
      return state
    }
  }
}
export default reducer