import React, { useState, useEffect } from "react"
import { ArrowLeft } from "react-feather"

import PerfectScrollbar from "react-perfect-scrollbar"

const TokenDetails = props => {

  return (
    <div
      className={`email-app-details ${props.currentStatus ? "show" : ""
        }`}
    >
      <div className="email-detail-header">
        <div className="email-header-left d-flex align-items-center mb-1">
          <ArrowLeft
            size={20}
            className="mr-1 cursor-pointer"
            onClick={() => {
              props.handleTokenDetails("close")
            }}
          />
          <h4 className="mb-0">Detail Token</h4>
        </div>
      </div>
    </div>
  )

}

export default TokenDetails
