import React, { useState } from "react"
import { Input, Label, Card, CardHeader, CardBody, Button, Row, Col, FormGroup, CustomInput, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { X, ArrowLeft, Home, Briefcase, Image, Folder, Box, Layers } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import Wizard from "../../components/@vuexy/wizard/WizardComponent"
import classnames from "classnames"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "../../assets/scss/plugins/extensions/editor.scss"
const CreateToken = props => {
  const [activeFile, setActiveFile] = useState("1")
  const toggle = tab => {
    if (activeFile !== tab) {
      setActiveFile(tab)
    }
  }
  const steps = [
    {
      title: <Folder size={20} />,
      content: <div className="nav-vertical">
        <Nav tabs className="nav-left">
          <NavItem>
            <NavLink
              className={classnames({
                active: activeFile === "1"
              })}
              onClick={() => {
                toggle("1")
              }}
            >
              Lib.sol
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeFile === "2"
              })}
              onClick={() => {
                toggle("2")
              }}
            >
              Token.sol
          </NavLink>
          </NavItem>

        </Nav>
        <TabContent activeTab={activeFile} className="mt-1">
          <TabPane tabId="1">
            Oat cake marzipan cake lollipop caramels wafer pie jelly
            beans. Icing halvah chocolate cake carrot cake. Jelly
            beans carrot cake marshmallow gingerbread chocolate cake.
            Gummies cupcake croissant.
        </TabPane>
          <TabPane tabId="2">
            Sugar plum tootsie roll biscuit caramels. Liquorice
            brownie pastry cotton candy oat cake fruitcake jelly chupa
            chups. Pudding caramels pastry powder cake soufflé wafer
            caramels. Jelly-o pie cupcake.
        </TabPane>

        </TabContent>
      </div>
    },
    {
      title: <Box size={20} />,
      content: <Row>
        <Col md="6" sm="12">
          <FormGroup>
            <Label> Proposal Title </Label>
            <Input type="text" />
          </FormGroup>
          <FormGroup>
            <Label> Job Title </Label>
            <Input type="text" />
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label> Proposal Title </Label>
            <Input type="textarea" rows="5" />
          </FormGroup>
        </Col>
      </Row>
    },
    {
      title: <Layers size={20} />,
      content: <Row>
        <Col md="6" sm="12">
          <FormGroup>
            <Label> Event Name </Label>
            <Input type="text" />
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label> Event Location </Label>
            <CustomInput type="select" name="select" id="location">
              <option>New York</option>
              <option>Chicago</option>
              <option>San Francisco</option>
              <option>Boston</option>
            </CustomInput>
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label> Event Status </Label>
            <CustomInput type="select" name="select" id="status">
              <option>Planning</option>
              <option>In Process</option>
              <option>Finished</option>
            </CustomInput>
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label> Event Status </Label>
            <Label className="mr-2">Requirements :</Label>
            <div className="stacked-checkbox">


            </div>
          </FormGroup>
        </Col>
      </Row>
    }
  ]

  return (
    <div
      className={`compose-email shadow-none ${props.currentStatus ? "open" : ""
        }`}
    >
      <div className="compose-mail-header align-items-center">
        <div className="compose-mail-title d-flex align-items-center mb-1">
          <ArrowLeft
            size={20}
            className="mr-1 cursor-pointer"
            onClick={() => props.handleComposeSidebar("close")}
          />
          <h4 className="mb-0">New token</h4>
        </div>
      </div>
      <div className="ml-1 mr-1">

        <Wizard
          steps={steps}
        />
      </div>
    </div>
  )

}

export default CreateToken
