import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button, FormGroup, Row, Col } from "reactstrap"
import { Plus, ArrowLeft, X, Edit, Trash } from 'react-feather'
import { getListVChain, deleteVChain } from "../../redux/actions/vchain/index"
import SweetAlert from 'react-bootstrap-sweetalert';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "react-toastify/dist/ReactToastify.css"

import { toast, ToastContainer } from "react-toastify"


const DetailVChain = (props) => {
    const [confirmDeleteModal, openModalConfirmDelete] = useState(false)

    const onEditVChain = () => {
        alert("edit account not implement")
    }
    const onDeleteVChain = () => {
        openModalConfirmDelete(true)
    }

    const handleDeleteVChain = async () => {
        const res = await props.deleteVChain(props.data.id)
        openModalConfirmDelete(false)
        if (res.code) {
            props.onClose()
            props.getListVChain()
        } else {
            return
        }
    }

    return <React.Fragment>
        <div className={`vchain-detail ${props.visible ? "show" : ""}`}>
            <div className="vchain-detail-header">
                <X onClick={props.onClose}
                    size={20}
                    className="mr-1 cursor-pointer"
                />
                <h4 className="mb-0">Detail VChain</h4>
            </div>
            <div className="m-2">
                <div className="d-flex vchain-info">
                    <div className="vchain-info-title font-weight-bold">Account name</div>
                    <div>{props?.data?.name || ""}</div>
                </div>
                <div className="d-flex vchain-info">
                    <div className="vchain-info-title font-weight-bold">Account address</div>
                    <div>{props?.data?.address || ""}</div>
                </div>
                <div className="d-flex vchain-info">
                    <div className="vchain-info-title font-weight-bold">Account private key</div>
                    <div>{props?.data?.key || ""}</div>
                </div>
                <div className="vchain-info-action">
                    <Button.Ripple className="mr-1" color="primary" outline
                        onClick={onEditVChain}>
                        <Edit size={15} />
                        <span className="align-middle ml-50">Edit</span>
                    </Button.Ripple>
                    <Button.Ripple color="danger" outline
                        onClick={onDeleteVChain}>
                        <Trash size={15} />
                        <span className="align-middle ml-50">Delete</span>
                    </Button.Ripple>
                </div>
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
            onConfirm={handleDeleteVChain}
            onCancel={() => {
                openModalConfirmDelete(false)
            }}
        >
            You won't be able to revert this!
        </SweetAlert>
    </React.Fragment>
}

const mapDispatchToProps = {
    getListVChain,
    deleteVChain
}

export default connect(null, mapDispatchToProps)(DetailVChain)