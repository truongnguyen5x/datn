import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button, FormGroup, Row, Col, NavLink, NavItem, TabContent, TabPane, Nav } from "reactstrap"
import { Plus, ArrowLeft, X, Edit, Trash } from 'react-feather'
import { getListVCoin, deleteVCoin, exportSDK } from "../../redux/actions/vcoin/index"
import SweetAlert from 'react-bootstrap-sweetalert';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "react-toastify/dist/ReactToastify.css"
import classnames from "classnames"
import { toast, ToastContainer } from "react-toastify"
import moment from 'moment'
import Editor from './Editor'
import { saveAs } from 'file-saver';

const DetailVCoin = (props) => {
    const [confirmDeleteModal, openModalConfirmDelete] = useState(false)
    const [activeTab, setActiveTab] = useState("1")

    const onSetMain = () => {
        alert("not implement")
    }
    const onDeleteVCoin = () => {
        alert("not implement !")
    }

    const handleDeleteVCoin = async () => {
        const res = await props.deleteVCoin(props.data.id)
        openModalConfirmDelete(false)
        if (res.code) {
            props.onClose()
            props.getListVCoin()
        } else {
            return
        }
    }
    const toggleTab = tab => {
        if (activeTab !== tab) {
            setActiveTab(tab)
        }
    }

    const onExportSDK = async () => {
        const res = await props.exportSDK(props.data.smartContract.id)
        const blob = new Blob([res], {
            type: 'application/octet-stream'
          })
          const filename = 'download.zip'
          saveAs(blob, filename)
    }

    return <React.Fragment>
        <div className={`vcoin-detail ${props.visible ? "show" : ""}`}>
            <div className="vcoin-detail-header">
                <X onClick={props.onClose}
                    size={20}
                    className="mr-1 cursor-pointer"
                />
                <h4 className="mb-0">Detail VCoin</h4>
            </div>
            <div className="m-2 vcoin-detail-body">

                <TabPane tabId="1">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === "1"
                                })}
                                onClick={() => {
                                    toggleTab("1")
                                }}
                            >
                                General Infomation
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === "2"
                                })}
                                onClick={() => {
                                    toggleTab("2")
                                }}
                            >
                                List tokens
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === "3"
                                })}
                                onClick={() => {
                                    toggleTab("3")
                                }}
                            >
                                Source code
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent className="py-50" activeTab={activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col md={6}>
                                    <div className="d-flex vcoin-info">
                                        <div className="vcoin-info-title font-weight-bold">ID</div>
                                        <div>{props?.data?.id || ""}</div>
                                    </div>
                                    <div className="d-flex vcoin-info">
                                        <div className="vcoin-info-title font-weight-bold">Account address</div>
                                        <div>{props?.data?.smartContract?.owner?.address || ""}</div>
                                    </div>
                                    <div className="d-flex vcoin-info">
                                        <div className="vcoin-info-title font-weight-bold">Smart contract address</div>
                                        <div>{props?.data?.smartContract?.address || ""}</div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex vcoin-info">
                                        <div className="vcoin-info-title font-weight-bold">Created At</div>
                                        <div>{moment(props?.data?.createdAt).format("DD/MM/YYYY hh:mm:ss")}</div>
                                    </div>
                                    <div className="d-flex vcoin-info">
                                        <div className="vcoin-info-title font-weight-bold">Deploy on network</div>
                                        <div>{props?.data?.smartContract?.network?.path || ""}</div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="vcoin-info-action">
                                <Button.Ripple className="mr-1" color="primary" outline
                                    onClick={onSetMain}>
                                    <Edit size={15} />
                                    <span className="align-middle ml-50">Use for VChain</span>
                                </Button.Ripple>
                                <Button.Ripple color="info" outline className=" mr-1"
                                    onClick={onExportSDK}>
                                    <Trash size={15} />
                                    <span className="align-middle ml-50">Export SDK</span>
                                </Button.Ripple>
                                <Button.Ripple color="danger" outline
                                    onClick={onDeleteVCoin}>
                                    <Trash size={15} />
                                    <span className="align-middle ml-50">Delete from backend</span>
                                </Button.Ripple>
                            </div>
                        </TabPane>
                        <TabPane tabId="2">
                            Pie muffin cake macaroon marzipan pudding pastry. Marzipan
                            muffin oat cake sweet roll tootsie roll I love marshmallow
                            pie pastry. Jelly beans I love pie sugar plum sugar plum
                            soufflé liquorice bonbon sesame snaps. Bear claw sugar plum
                            apple pie sesame snaps wafer chocolate bar chocolate cookie
                            gingerbread. Gummies chocolate cake jujubes tart halvah. I
                            love sesame snaps apple pie. Cupcake cookie bear claw pie
                            cotton candy gummies.
                            </TabPane>
                        <TabPane tabId="3">
                            <Editor onChange={() => { }} />
                        </TabPane>
                    </TabContent>
                </TabPane>


            </div>
        </div>
        <ToastContainer />
        <SweetAlert title="Are you sure?"
            warning
            show={confirmDeleteModal}
            showCancel
            reverseButtons
            cancelBtnBsStyle="danger"
            confirmBtnText="Yes, delete it!"
            cancelBtnText="Cancel"
            onConfirm={handleDeleteVCoin}
            onCancel={() => {
                openModalConfirmDelete(false)
            }}
        >
            You won't be able to revert this!
        </SweetAlert>
    </React.Fragment>
}

const mapDispatchToProps = {
    getListVCoin,
    deleteVCoin,
    exportSDK
}

const mapStateToProps = state => {
    return {
        data: state.vcoin.vcoin
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailVCoin)