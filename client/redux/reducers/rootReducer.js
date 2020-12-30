import { combineReducers } from "redux"
import calenderReducer from "./calendar/"
import emailReducer from "./email/"
import chatReducer from "./chat/"
import todoReducer from "./todo/"
import customizer from "./customizer/"
import auth from "./auth/"
import navbar from "./navbar/Index"
import dataList from "./data-list/"
import account from "./account"
import vcoin from "./vcoin"
import tokenAdmin from "./token-admin"
import tokenDev from "./token-dev"
import network from "./network"

const rootReducer = combineReducers({
  calendar: calenderReducer,
  emailApp: emailReducer,
  todoApp: todoReducer,
  chatApp: chatReducer,
  customizer: customizer,
  auth: auth,
  navbar: navbar,
  dataList: dataList,
  account: account,
  vcoin: vcoin,
  tokenAdmin: tokenAdmin,
  tokenDev: tokenDev,
  network: network
})

export default rootReducer
