import React, { useState } from "react"
import { FormGroup, Button, ListGroup, ListGroupItem } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import { X, Plus, Mail, Send, Edit2, Star, Info, Trash } from "react-feather"

import { connect } from "react-redux"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "../../assets/scss/plugins/extensions/editor.scss"
const TokenSidebar = props => {



  return (
    <React.Fragment>
      <div
        className="sidebar-close-icon"
        onClick={() => props.mainSidebar(false)}
      >
        <X size={18} />
      </div>
      <div className="token-app-menu">
      
        <PerfectScrollbar
          className="sidebar-menu-list"
          options={{
            wheelPropagation: false
          }}
        >
          <ListGroup className="list-group-messages font-medium-1">
            <ListGroupItem
          
              active={props.filter == 'used'}
              className="border-0 cursor-pointer pt-0"
            >
              <Mail size={21} />
              <span className="align-middle ml-1">Used</span>
            </ListGroupItem>
            <ListGroupItem
       
              active={props.filter == 'unused'}
              className="border-0 cursor-pointer"
            >
              <Send size={21} />
              <span className="align-middle ml-1">Unused</span>
            </ListGroupItem>
          </ListGroup>
        </PerfectScrollbar>
      </div>
    </React.Fragment>
  )
}


export default connect(null, null)(TokenSidebar)
