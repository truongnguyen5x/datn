import React from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { CloudRain, List, Plus, Upload, X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { Button, FormGroup, ListGroup, ListGroupItem } from "reactstrap"
import "../../assets/scss/plugins/extensions/editor.scss"
import { changeFilter, setModalOpen } from "../../redux/actions/token-dev"
const TokenSidebar = (props) => {

  return (
    <React.Fragment>
      <div
        className="sidebar-close-icon"
        onClick={() => props.mainSidebar(false)}
      >
        <X size={18} />
      </div>
      <div className="token-app-menu">
        <FormGroup className="form-group-compose text-center compose-btn">
          <Button.Ripple
            block
            className="my-2 btn-block"
            color="primary"
            onClick={() => {
              props.setModalOpen("create")
              props.mainSidebar(false)
            }}
          >
            <Plus size={14} />
            <span className="align-middle ml-50">Create</span>
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
              onClick={() => props.changeFilter("all")}
              active={"all" === props.listType}
              className="border-0 cursor-pointer pt-0"
            >
              <List size={21} />
              <span className="align-middle ml-1">All token</span>
            </ListGroupItem>
            <ListGroupItem
              onClick={() => props.changeFilter("in-vchain")}
              active={"in-vchain" === props.listType}
              className="border-0 cursor-pointer"
            >
              <CloudRain size={21} />
              <span className="align-middle ml-1">On Vchain</span>
            </ListGroupItem>
            <ListGroupItem
              onClick={() => props.changeFilter("requested")}
              active={"requested" === props.listType}
              className="border-0 cursor-pointer"
            >
              <Upload size={21} />
              <span className="align-middle ml-1">Requested</span>
            </ListGroupItem>
          </ListGroup>
        </PerfectScrollbar>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    listType: state.tokenDev.listType,
    modalOpen: state.tokenDev.modalOpen
  }
}

export default connect(mapStateToProps, { changeFilter, setModalOpen })(TokenSidebar)
