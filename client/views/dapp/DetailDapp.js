
import React, { useEffect, useState, useRef } from 'react'
import { Button, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Media, Col, Row, Input } from 'reactstrap'
import { Formik, Field, Form, ErrorMessage } from "formik"
import UpdateDapp from "./UpdateDapp"
import * as Yup from "yup"
import { connect } from 'react-redux'
import { deleteDapp, getListDapp } from '../../redux/actions/dapp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'react-bootstrap-sweetalert'
import avatarImg from "../../assets/img/coin/ether.png"
import "../../assets/scss/pages/dapp.scss"

const DetailDapp = (props) => {

    const [isConfirmDelete, setConfirmDelete] = useState(false)
    const [openModalUpdate, setModalUpdate] = useState(false)

    const renderButton = () => {
        return <><Button color="primary" type="button" onClick={() => { setModalUpdate(true); props.onClose() }}>
            Update
                </Button>{" "}<Button color="danger" onClick={() => setConfirmDelete(true)} type="button">
                Delete
                </Button>{" "}
        </>

    }

    const renderTitleModal = () => {
        return "Detail DAPP"

    }

    const onDeleteDapp = async () => {
        try {
            const res = await props.deleteDapp(props.data.id)
            if (!res.code) {
                toast.error("Error")
                return
            }
            toast.success("Success!")
            props.onClose()
            props.getListDapp()
        } catch (error) {
            toast.error("Error")
        }
    }

    // const { name, code, description } = props.data
    return <React.Fragment>
        <ToastContainer />
        <Modal
            isOpen={props.visible}
            toggle={props.onClose}
            className={props.className + " modal-dialog-centered modal-lg"}
        >


            <ModalHeader toggle={props.onClose}>
                {renderTitleModal()}
            </ModalHeader>
            <ModalBody>
                <Media>
                    <Media left>
                        <Media
                            className="rounded mr-2"
                            object
                            src={avatarImg}
                            alt="Generic placeholder image"
                            height="112"
                            width="112"
                        />
                    </Media>
                    <Media body>
                        <div className="dapp-page-view-table">
                            <div className="d-flex dapp-info">
                                <div className="dapp-info-title font-weight-bold">
                                    Name
                                </div>
                                <div>{props?.data?.name}</div>
                            </div>
                            <div className="d-flex dapp-info">
                                <div className="dapp-info-title font-weight-bold">
                                    Description
                                </div>
                                <div>{props?.data?.description}</div>
                            </div>
                            <div className="d-flex dapp-info">
                                <div className="dapp-info-title font-weight-bold">
                                    Tokens: 
                                </div>
                                <div>{props?.data?.Tokens?.map(i=>i.symbol)?.join(", ")}</div>
                            </div>

                        </div>


                    </Media>
                </Media>

                <hr />
                <Input
                    style={{height: "400px"}}
                    disabled
                    type="textarea"
                    value={props?.data?.code}
                />

            </ModalBody>

            <ModalFooter>
                {renderButton()}
            </ModalFooter>


        </Modal>
        <SweetAlert title="Are you sure?"
            warning
            show={isConfirmDelete}
            showCancel
            reverseButtons
            cancelBtnBsStyle="danger"
            confirmBtnText="Yes, delete it!"
            cancelBtnText="Cancel"
            onConfirm={() => {
                setConfirmDelete(false)
                onDeleteDapp()

            }}
            onCancel={() => {
                setConfirmDelete(false)
            }}
        >
            You won't be able to revert this!
        </SweetAlert>
        <UpdateDapp
            visible={openModalUpdate}
            onClose={() => setModalUpdate(false)}
            data={props.data}

        />
    </React.Fragment>
}


const mapDispatchToProps = {
    deleteDapp,
    getListDapp,

}


export default connect(null, mapDispatchToProps)(DetailDapp)