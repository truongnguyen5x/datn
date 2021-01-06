import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    id: "homepage",
    title: "Homepage",
    type: "item",
    icon: <Icon.Home size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/"
  },
  {
    id: "token-admin",
    title: "Token",
    type: "item",
    icon: <Icon.DollarSign size={20} />,
    permissions: ["admin"],
    navLink: "/token-admin"
  }
]

export default navigationConfig
