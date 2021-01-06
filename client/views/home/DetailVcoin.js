import React, { useEffect, useState } from "react"
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Input } from 'reactstrap'
import { Edit } from 'react-feather'
import { getNetType } from '../../utility/web3'


const EditVcoin = props => {
    const [fee, setFee] = useState(0)
    const onSave = () => {

    }
    useEffect(() => {
        if (props.data) {
            setFee(props.data.swap_fee)
        }
    }, [props.data])

    return <Modal
        toggle={props.onClose}
        isOpen={props.visible}>
        <ModalHeader toggle={props.onClose}>
            Edit Vcoin
        </ModalHeader>
        <ModalBody>
            <div className="mb-1">VCoin on network {getNetType(props?.data?.network_id)}</div>
            <div>Address: {props?.data?.address}</div>
            <div>Account: {props?.data?.account}</div>
            <div className="mt-1">
                Swap fee: 
            </div>
            <Input
                placeholder="Swap fee"
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
            />
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={onSave}>
                <Edit size={15} />
                Save
                    </Button>{" "}
        </ModalFooter>
    </Modal>
}

export default EditVcoin