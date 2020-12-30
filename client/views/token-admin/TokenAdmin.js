import React, { useEffect, useState } from "react"
import Sidebar from "react-sidebar"
import "../../assets/scss/pages/token-admin.scss"
import { ContextLayout } from "../../utility/context/Layout"
import TokenList from "./TokenList"
import TokenSidebarContent from "./TokenSidebar"
const mql = window.matchMedia(`(min-width: 992px)`)
const TokenAdmin  = () => {
  const [sidebarDocked, setSidebarDocked] = useState(mql.matches)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    mql.addListener(mediaQueryChanged)
    return () => {
      mql.addListener(mediaQueryChanged)
    }
  }, [])

  const mediaQueryChanged = () => {
    setSidebarDocked(mql.matches)
    setSidebarOpen(false)
  }

    return (
      <div className="token-application position-relative">
    
        <ContextLayout.Consumer>
          {context => (
            <Sidebar
              sidebar={
                <TokenSidebarContent
                mainSidebar={open => setSidebarOpen(open)}
                />
              }
              docked={sidebarDocked}
              open={sidebarOpen}
              sidebarClassName="sidebar-content token-app-sidebar d-flex"
              touch={false}
              contentClassName="sidebar-children"
              pullRight={context.state.direction === "rtl"}>
              ""
            </Sidebar>
          )}
        </ContextLayout.Consumer>
        <TokenList
                mainSidebar={open => setSidebarOpen(open)}
        />
      </div>
    )
  
}
export default TokenAdmin
