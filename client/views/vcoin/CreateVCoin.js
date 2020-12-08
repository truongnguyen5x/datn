import React, { useEffect, useState, useRef, useReducer } from 'react'
import { connect } from "react-redux"
import { Button, FormGroup, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Label } from "reactstrap"
import { Plus, ArrowLeft, X } from 'react-feather'
import { getListVCoin, createVCoin } from "../../redux/actions/vcoin/index"
import { getListNetwork } from "../../redux/actions/network"
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "react-toastify/dist/ReactToastify.css"
import "../../assets/scss/pages/vcoin.scss"
import { toast, ToastContainer } from "react-toastify"
import classnames from "classnames"
import Select from 'react-select'
import Editor from './Editor'

const CreateVCoin = (props) => {
    const [activeTab, setActiveTab] = useState("1")
    const [network, setNetwork] = useState()
    const formRef = useRef()

    useEffect(() => {
        props.getListNetwork()
    }, [])

    const toggle = tab => {
        if (activeTab !== tab) {
            setActiveTab(tab)
        }
    }


    const colourOptions = props.listNetwork.map(i => ({ value: i.id, label: i.path }))

    return <React.Fragment>
        <div className={`vcoin-detail ${props.visible ? "show" : ""}`}>
            <div className="vcoin-detail-header">
                <X onClick={props.onClose}
                    size={20}
                    className="mr-1 cursor-pointer"
                />
                <h4 className="mb-0">Create VCoin</h4>
            </div>
            <div className="m-2">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({
                                active: activeTab === "1"
                            })}
                            onClick={() => {
                                toggle("1")
                            }}
                        >
                            Infomation
                     </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({
                                active: activeTab === "2"
                            })}
                            onClick={() => {
                                toggle("2")
                            }}
                        >
                            Source code
                            </NavLink>
                    </NavItem>
                </Nav>
                <Formik >
                    {(formProps) => <Form>

                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm={12} md={6}>
                                        <FormGroup>
                                            <Label for="network">Select one network:</Label>
                                            <Field
                                                name="network"
                                            >
                                                {() => <Select options={colourOptions} />

                                                }
                                            </Field>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Editor />
                            </TabPane>
                        </TabContent>
                    </Form>}

                </Formik>

            </div>
        </div>
        <ToastContainer />
    </React.Fragment>
}

const mapDispatchToProps = {
    getListVCoin,
    createVCoin,
    getListNetwork
}

const mapStateToProps = state => {
    return {
        listNetwork: state.network.listNetwork,
        listAccount: state.account.listAccount
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateVCoin)