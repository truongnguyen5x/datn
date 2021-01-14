import React, { useEffect, useState } from "react"
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Input } from 'reactstrap'
import { Edit } from 'react-feather'
import { getNetType, sendWithEstimateGas, getWeb3 } from '../../utility/web3'
import { useFormik } from 'formik'
import { setLoading } from '../../redux/actions/home'
import { updateVCoin, getListVCoin } from '../../redux/actions/vcoin'
import _ from 'lodash'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

const validate = values => {
    const errors = {}
    if (!values.fee) {
        errors.fee = 'Required!'
    }
    return errors
}


const EditVcoin = props => {
    const [web3, setWeb3] = useState()
    const [accs, setAccs] = useState([])
    const [netId, setNetId] = useState(0)

    const formik = useFormik({
        initialValues: {
            fee: 0
        },
        validate
    })
    const onSave = async () => {
        const errors = await formik.validateForm()
        if (!_.isEmpty(errors)) {
            return
        }
        const { address, account, abi, network_id, id } = props.data
        if (!web3) {
            Swal.fire({
                icon: 'Error',
                title: 'Not found Metamask !',
                text: 'Plese enable Metamask !'
            })
            return
        }
        if (account != accs[0]) {
            Swal.fire({
                icon: 'Error',
                title: 'Account metamask not match !',
                text: `Please use account ${account} !`
            })
            return
        }
        props.setLoading(true)
        // console.log(props.data, JSON.parse(abi))
        const vcoinContract = new web3.eth.Contract(JSON.parse(abi), address)
        const transaction = vcoinContract.methods.setSwapFee(formik.values.fee)
        sendWithEstimateGas(transaction, accs[0])
            .then(async () => {
                const res = await props.updateVCoin({ id, fee: formik.values.fee })
                if (res.code) {
                    props.onClose()
                    props.getListVCoin()
                    toast.success('Edit vcoin success')
                } else {
                    toast.error('Edit vcoin fail')
                }
                props.setLoading(false)
            })
            .catch(error => {
                console.log(error)
                toast.error('Edit vcoin fail')
                props.setLoading(false)
            })
    }

    useEffect(() => {
        if (props.data) {
            formik.setFieldValue('fee', props.data.swap_fee)
        }
    }, [props.data])

    useEffect(() => {
        getWeb3()
            .then(res => {
                if (res) {
                    setWeb3(res)
                    getInfo(res)
                }
            })
            .catch(err => console.log(err))
    }, [])

    const getInfo = async (web3) => {
        web3.eth.getAccounts().then(listAcc => {
            setAccs(listAcc)
        })
        web3.eth.net.getId().then(netId => {
            setNetId(netId)
        })
    }

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
                invalid={formik.touched.fee && formik.errors.fee}
                name="fee"
                placeholder="Swap fee"
                type="number"
                value={formik.values.fee}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
            />
            {formik.touched.fee && formik.errors.fee && <div className="error-text">{formik.errors.fee}</div>}
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={onSave}>
                <Edit size={15} />
                Save
                    </Button>{" "}
        </ModalFooter>
    </Modal>
}

const mapDispatchToProps = {
    setLoading,
    updateVCoin,
    getListVCoin
}

export default connect(null, mapDispatchToProps)(EditVcoin)