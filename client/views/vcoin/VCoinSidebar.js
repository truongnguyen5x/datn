import React, { useState } from "react"
import { FormGroup, Button, ListGroup, ListGroupItem } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import { X, Plus, Mail, Send, Edit2, Star, Info, Trash } from "react-feather"
import { getListVCoin } from "../../redux/actions/vcoin"
import { connect } from "react-redux"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "../../assets/scss/plugins/extensions/editor.scss"
const VCoinSidebar = props => {



  return (
    <React.Fragment>
      <div
        className="sidebar-close-icon"
        onClick={() => props.mainSidebar(false)}
      >
        <X size={18} />
      </div>
      <div className="email-app-menu">
        <FormGroup className="form-group-compose text-center compose-btn">
          <Button.Ripple
            block
            className="my-2 btn-block"
            color="primary"
            onClick={() => {
              props.handleComposeSidebar("open")
              props.mainSidebar(false)
            }}
          >
            <Plus size={14} />
            <span className="align-middle ml-50">Add</span>
          </Button.Ripple>
        </FormGroup>
        <PerfectScrollbar
          className="sidebar-menu-list"
          options={{
            wheelPropagation: false
          }}
        >
          <ListGroup className="list-group-messages font-medium-1">
            <ListGroupItem
              onClick={() => props.getListVCoin("used")}
              active={true}
              className="border-0 cursor-pointer pt-0"
            >
              <Mail size={21} />
              <span className="align-middle ml-1">Inbox</span>
              <div className="badge badge-pill badge-primary mt-25 float-right">
                <span className="align-middle">3</span>
              </div>
            </ListGroupItem>
            <ListGroupItem
              onClick={() => props.getListVCoin("unused")}
              active={false}
              className="border-0 cursor-pointer"
            >
              <Send size={21} />
              <span className="align-middle ml-1">Sent</span>
            </ListGroupItem>


          </ListGroup>


        </PerfectScrollbar>
      </div>
    </React.Fragment>
  )
}

export default connect(null, { getListVCoin })(VCoinSidebar)
