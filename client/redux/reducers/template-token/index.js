const initState = {
  listTemplateToken: []
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_LIST_TEMPLATE_TOKEN": {
      return { ...state, listTemplateToken: action.payload }
    }
    default: {
      return state
    }
  }
}
export default reducer