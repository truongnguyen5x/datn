import React, { useState } from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'
import { Edit, Trash, X } from 'react-feather'
import { connect } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "reactstrap"
import { deleteAccount, getListAccount } from "../../redux/actions/account/index"



const DetailAccount = (props) => {
    const [confirmDeleteModal, openModalConfirmDelete] = useState(false)

    const onEditAccount = () => {
        alert("edit account not implement")
    }
    const onDeleteAccount = () => {
        openModalConfirmDelete(true)
    }

    const handleDeleteAccount = async () => {
        const res = await props.deleteAccount(props.data.id)
        openModalConfirmDelete(false)
        if (res.code) {
            props.onClose()
            props.getListAccount()
        } else {
            return
        }
    }

    return <React.Fragment>
        <div className={`account-detail ${props.visible ? "show" : ""}`}>
            <div className="account-detail-header">
                <X onClick={props.onClose}
                    size={20}
                    className="mr-1 cursor-pointer"
                />
                <h4 className="mb-0">Detail Account</h4>
            </div>
            <div className="m-2">
                <div className="d-flex account-info">
                    <div className="account-info-title font-weight-bold">Account name</div>
                    <div>{props?.data?.name || ""}</div>
                </div>
                <div className="d-flex account-info">
                    <div className="account-info-title font-weight-bold">Account address</div>
                    <div>{props?.data?.address || ""}</div>
                </div>
                <div className="d-flex account-info">
                    <div className="account-info-title font-weight-bold">Account private key</div>
                    <div>{props?.data?.key || ""}</div>
                </div>
                <div className="account-info-action">
                    <Button.Ripple className="mr-1" color="primary" outline
                        onClick={onEditAccount}>
                        <Edit size={15} />
                        <span className="align-middle ml-50">Edit</span>
                    </Button.Ripple>
                    <Button.Ripple color="danger" outline
                        onClick={onDeleteAccount}>
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
            onConfirm={handleDeleteAccount}
            onCancel={() => {
                openModalConfirmDelete(false)
            }}
        >
            You won't be able to revert this!
        </SweetAlert>
    </React.Fragment>
}

const mapDispatchToProps = {
    getListAccount,
    deleteAccount
}

export default connect(null, mapDispatchToProps)(DetailAccount)