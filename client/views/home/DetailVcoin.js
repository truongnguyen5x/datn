import { useFormik } from 'formik'
import _ from 'lodash'
import React, { useEffect, useState } from "react"
import { Edit } from 'react-feather'
import { connect } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { getListVCoin, updateVCoin } from '../../redux/actions/vcoin'
import EditVcoin from './EditVcoin'
import { getNetType, getWeb3, sendWithEstimateGas } from '../../utility/web3'
import moment from 'moment'

const DetailVcoin = props => {
    const [modalEdit, openModalEdit] = useState(false)
    console.log(props.data)
    return <React.Fragment>

        <Modal
            size="lg"
            className="detail-vcoin-modal"
            toggle={props.onClose}
            isOpen={props.visible}>
            <ModalHeader toggle={props.onClose}>
                Detail Vcoin
            </ModalHeader>
            <ModalBody>
                <div>ID: {props?.data?.id}</div>
                <div className="mb-1">VCoin on network {getNetType(props?.data?.network_id)}</div>

                <div className="vcoin-detail">
                    <div className="vcoin-detail-title">Address: </div>
                    <div className="vcoin-detail-info">{props?.data?.address}</div>
                </div>
                <div className="vcoin-detail">
                    <div className="vcoin-detail-title">Account:</div>
                    <div className="vcoin-detail-info"> {props?.data?.account} </div>
                </div>
                <div className="vcoin-detail">
                    <div className="vcoin-detail-title">  Swap fee: </div>
                    <div className="vcoin-detail-info">{props?.data?.swap_fee} </div>
                </div>
                <div className="vcoin-detail">
                    <div className="vcoin-detail-title"> Created at </div>
                    <div className="vcoin-detail-info"> {moment(props?.data?.createdAt).format('hh:mm DD/MM/YYYY')} </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => { openModalEdit(true); props.onClose() }}>
                    <Edit size={15} />
                        Edit
                    </Button>
            </ModalFooter>
        </Modal>
        <EditVcoin
            data={props.data}
            visible={modalEdit}
            onClose={() => {
                openModalEdit(false)
            }}
        />
    </React.Fragment>
}

const mapDispatchToProps = {
    updateVCoin,
    getListVCoin
}

export default connect(null, mapDispatchToProps)(DetailVcoin)