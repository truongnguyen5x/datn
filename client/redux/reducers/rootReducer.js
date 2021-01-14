import { combineReducers } from "redux"
import account from "./account"
import auth from "./auth/"
import calenderReducer from "./calendar/"
import chatReducer from "./chat/"
import customizer from "./customizer/"
import dataList from "./data-list/"
import emailReducer from "./email/"
import navbar from "./navbar/Index"
import network from "./network"
import todoReducer from "./todo/"
import tokenAdmin from "./token-admin"
import tokenDev from "./token-dev"
import vcoin from "./vcoin"
import home from "./home"

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
  network: network,
  home
})

export default rootReducer
