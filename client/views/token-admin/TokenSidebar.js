import React from "react"
import { FormGroup, Button, ListGroup, ListGroupItem } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import { X, Edit, Mail, Send, Edit2, Star, Info, Trash, List, Globe, Upload, Plus } from "react-feather"
import { changeFilterAdmin } from "../../redux/actions/token"
import { connect } from "react-redux"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "../../assets/scss/plugins/extensions/editor.scss"
class TokenSidebar extends React.Component {
  state = {
    modal: false
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="sidebar-close-icon"
          onClick={() => this.props.mainSidebar(false)}
        >
          <X size={18} />
        </div>
        <div className="email-app-menu">
          {/* <FormGroup className="form-group-compose text-center compose-btn">
            <Button.Ripple
              block
              className="my-2 btn-block"
              color="primary"
              onClick={() => {
                this.props.handleComposeSidebar("open")
                this.props.mainSidebar(false)
              }}
            >
              <Plus size={14} />
              <span className="align-middle ml-50">Create</span>
            </Button.Ripple>
          </FormGroup> */}
          <PerfectScrollbar
            className="sidebar-menu-list"
            options={{
              wheelPropagation: false
            }}
          >
            <ListGroup className="list-group-messages font-medium-1 mt-1">
              <ListGroupItem
                onClick={() => this.props.changeFilterAdmin("pending")}
                active={"pending" === this.props.listType}
                className="border-0 cursor-pointer pt-0"
              >
                <Upload size={21} />
                <span className="align-middle ml-1">Pending token</span>
              </ListGroupItem>
              <ListGroupItem
                onClick={() => this.props.changeFilterAdmin("in-vchain")}
                active={"in-vchain" === this.props.listType}
                className="border-0 cursor-pointer"
              >
                <Globe size={21} />
                <span className="align-middle ml-1">In Vchain</span>
              </ListGroupItem>              
             

            </ListGroup>
          </PerfectScrollbar>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    listType: state.token.listTypeAdmin
  }
}

export default connect(mapStateToProps, { changeFilterAdmin })(TokenSidebar)
