import React from "react"
import Sidebar from "react-sidebar"
import TokenList from "./TokenList"
import TokenSidebarContent from "./TokenSidebar"
import { ContextLayout } from "../../utility/context/Layout"
import "../../assets/scss/pages/token-dev.scss"
const mql = window.matchMedia(`(min-width: 992px)`)
class Email extends React.Component {
  state = {
    composeMailStatus: false,
    sidebarDocked: mql.matches,
    sidebarOpen: false
  }
  handleComposeSidebar = status => {
    if (status === "open") {
      this.setState({
        composeMailStatus: true
      })
    } else {
      this.setState({
        composeMailStatus: false
      })
    }
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

  handleMainAndComposeSidebar = () => {
    this.handleComposeSidebar("close")
    this.onSetSidebarOpen(false)
  }

  render() {
    return (
      <div className="email-application position-relative">
    
        <ContextLayout.Consumer>
          {context => (
            <Sidebar
              sidebar={
                <TokenSidebarContent
                  handleComposeSidebar={this.handleComposeSidebar}
                  mainSidebar={this.onSetSidebarOpen}
                />
              }
              docked={this.state.sidebarDocked}
              open={this.state.sidebarOpen}
              sidebarClassName="sidebar-content email-app-sidebar d-flex"
              touch={false}
              contentClassName="sidebar-children"
              pullRight={context.state.direction === "rtl"}>
              ""
            </Sidebar>
          )}
        </ContextLayout.Consumer>
        <TokenList

          handleComposeSidebar={this.handleComposeSidebar}
          showCreateModal={this.state.composeMailStatus}
          mainSidebar={this.onSetSidebarOpen}
          routerProps={this.props}
        />
      </div>
    )
  }
}
export default Email
