import { useFormik } from 'formik'
import _ from 'lodash'
import React, { useEffect, useState } from "react"
import { Edit } from 'react-feather'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { setLoading } from '../../redux/actions/home'
import { getListVCoin, updateVCoin } from '../../redux/actions/vcoin'
import { getNetType, getWeb3, sendWithEstimateGas } from '../../utility/web3'

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
                icon: 'error',
                title: 'Not found Metamask !',
                text: 'Plese enable Metamask !'
            })
            return
        }
        if (account != accs[0]) {
            Swal.fire({
                icon: 'error',
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
                if (window.ethereum) {
                    window.ethereum.on('accountsChanged', (accounts) => {
                      setAccs(accounts.map(i => i.toUpperCase()))
                    });
                    window.ethereum.on('chainChanged', (chainId) => {
                      setNetId(res.utils.hexToNumber(chainId))
                    });
                  }
                if (res) {
                    setWeb3(res)
                    getInfo(res)
                }
            })
            .catch(err => console.log(err))
    }, [])

    const getInfo = async (web3) => {
        web3.eth.getAccounts().then(listAcc => {
            setAccs(listAcc.map(i => i.toUpperCase()))
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