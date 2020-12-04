const initState = {
  listDapp: [],
  listTemplateDapp: []
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_LIST_DAPP": {
      return { ...state, listDapp: action.payload }
    }
    case "GET_LIST_TEMPLATE_DAPP": {
      return {...state, listTemplateDapp: action.payload}
    }
    default: {
      return state
    }
  }
}
export default reducer