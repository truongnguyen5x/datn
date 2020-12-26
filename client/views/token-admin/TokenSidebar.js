import React from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { CloudRain, Upload, X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { ListGroup, ListGroupItem } from "reactstrap"
import "../../assets/scss/plugins/extensions/editor.scss"
import { changeFilter } from "../../redux/actions/token-admin"
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
        {/* <FormGroup className="form-group-compose text-center compose-btn">
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
              onClick={() => props.changeFilter("pending")}
              active={"pending" === props.listType}
              className="border-0 cursor-pointer pt-0"
            >
              <Upload size={21} />
              <span className="align-middle ml-1">Pending token</span>
            </ListGroupItem>
            <ListGroupItem
              onClick={() => props.changeFilter("in-vchain")}
              active={"in-vchain" === props.listType}
              className="border-0 cursor-pointer"
            >
              <CloudRain size={21} />
              <span className="align-middle ml-1">On Vchain</span>
            </ListGroupItem>


          </ListGroup>
        </PerfectScrollbar>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    listType: state.tokenAdmin.listType
  }
}

export default connect(mapStateToProps, { changeFilter })(TokenSidebar)
