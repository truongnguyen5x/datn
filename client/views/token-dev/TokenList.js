import React, { useEffect, useState } from "react"

import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"

import TokenDetails from "./TokenDetails"
import ComposeMail from "./CreateToken"

const TokenList = props => {
  // static getDerivedStateFromProps(props, state) {

  // }
  const [TokenDetailsVisibility, setTokenDetailsVisibility] = useState(false)


  const handleTokenDetails = (status, mail) => {
    if (status === "open")
      setTokenDetailsVisibility(true)
    else setTokenDetailsVisibility(false)
  }

  const handleComposeSidebar = status => {
    props.handleComposeSidebar(status)
  }


  const renderMails =
    <div className="no-results show">
      <h5>No Items Found</h5>
    </div>


  return (
    <div className="content-right">
      <div className="email-app-area">
        <div className="email-app-list-wrapper">
          <div className="email-app-list">
            <PerfectScrollbar
              className="email-user-list list-group"
              options={{
                wheelPropagation: false
              }}
            >
              <ul className="users-list-wrapper media-list">{renderMails}</ul>
            </PerfectScrollbar>
          </div>
        </div>
        <TokenDetails
          handleTokenDetails={handleTokenDetails}
          currentStatus={TokenDetailsVisibility}
        />

        <ComposeMail
          handleComposeSidebar={handleComposeSidebar}
          currentStatus={props.showCreateModal}
        />
      </div>
    </div>
  )

}
const mapStateToProps = state => {
  return {
  }
}
export default connect(mapStateToProps, {})(TokenList)
