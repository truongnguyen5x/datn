import React from "react"
import Sidebar from "react-sidebar"
import TokenList from "./TokenList"
import TokenSidebarContent from "./TokenSidebar"
import { ContextLayout } from "../../utility/context/Layout"
import "../../assets/scss/pages/token-dev.scss"
import { ToastContainer, toast } from 'react-toastify'
const mql = window.matchMedia(`(min-width: 992px)`)
class Token extends React.Component {
  state = {
    sidebarDocked: mql.matches,
    sidebarOpen: false
  }

  UNSAFE_componentWillMount() {
    mql.addListener(this.mediaQueryChanged)
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged)
  }

  onSetSidebarOpen = open => {
    this.setState({ sidebarOpen: open })
  }

  mediaQueryChanged = () => {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  render() {
    return (
      <div className="token-application position-relative">
        <ContextLayout.Consumer>
          {context => (
            <Sidebar
              sidebar={
                <TokenSidebarContent
                  mainSidebar={this.onSetSidebarOpen}
                />
              }
              docked={this.state.sidebarDocked}
              open={this.state.sidebarOpen}
              sidebarClassName="sidebar-content token-app-sidebar d-flex"
              touch={false}
              contentClassName="sidebar-children"
              pullRight={context.state.direction === "rtl"}>
              ""
            </Sidebar>
          )}
        </ContextLayout.Consumer>
        <TokenList
          mainSidebar={this.onSetSidebarOpen}
        />
        <ToastContainer />
      </div>
    )
  }
}
export default Token
