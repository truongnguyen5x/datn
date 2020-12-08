import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button, FormGroup, Row, Col } from "reactstrap"
import { Plus, ArrowLeft, X, Edit, Trash } from 'react-feather'
import { getListVCoin, deleteVCoin } from "../../redux/actions/vcoin/index"
import SweetAlert from 'react-bootstrap-sweetalert';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "react-toastify/dist/ReactToastify.css"

import { toast, ToastContainer } from "react-toastify"


const DetailVCoin = (props) => {
    const [confirmDeleteModal, openModalConfirmDelete] = useState(false)

    const onEditVCoin = () => {
        alert("edit account not implement")
    }
    const onDeleteVCoin = () => {
        openModalConfirmDelete(true)
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

    return <React.Fragment>
        <div className={`vcoin-detail ${props.visible ? "show" : ""}`}>
            <div className="vcoin-detail-header">
                <X onClick={props.onClose}
                    size={20}
                    className="mr-1 cursor-pointer"
                />
                <h4 className="mb-0">Detail VCoin</h4>
            </div>
            <div className="m-2">
                <div className="d-flex vcoin-info">
                    <div className="vcoin-info-title font-weight-bold">Account name</div>
                    <div>{props?.data?.name || ""}</div>
                </div>
                <div className="d-flex vcoin-info">
                    <div className="vcoin-info-title font-weight-bold">Account address</div>
                    <div>{props?.data?.address || ""}</div>
                </div>
                <div className="d-flex vcoin-info">
                    <div className="vcoin-info-title font-weight-bold">Account private key</div>
                    <div>{props?.data?.key || ""}</div>
                </div>
                <div className="vcoin-info-action">
                    <Button.Ripple className="mr-1" color="primary" outline
                        onClick={onEditVCoin}>
                        <Edit size={15} />
                        <span className="align-middle ml-50">Edit</span>
                    </Button.Ripple>
                    <Button.Ripple color="danger" outline
                        onClick={onDeleteVCoin}>
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
    deleteVCoin
}

export default connect(null, mapDispatchToProps)(DetailVCoin)