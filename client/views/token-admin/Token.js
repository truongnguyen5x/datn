import React from "react"
import Sidebar from "react-sidebar"
import TokenList from "./TokenList"
import TokenSidebarContent from "./TokenSidebar"
import { ContextLayout } from "../../utility/context/Layout"
import "../../assets/scss/pages/token-admin.scss"
const mql = window.matchMedia(`(min-width: 992px)`)
class Email extends React.Component {
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
      </div>
    )
  }
}
export default Email
