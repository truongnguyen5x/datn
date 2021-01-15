import { useFormik } from 'formik'
import _ from 'lodash'
import React, { useEffect, useState } from "react"
import { Edit } from 'react-feather'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
// import { await } from 'signale'
import Swal from 'sweetalert2'
import { setLoading } from '../../redux/actions/home'
import { getListToken, updateToken } from '../../redux/actions/token-admin'
import { getNetType, getWeb3, sendWithEstimateGas } from '../../utility/web3'


const validate = values => {
    const errors = {}
    if (!values.exchange_rate) {
        errors.exchange_rate = 'Required!'
    }
    return errors
}


const EditToken = props => {
    const [web3, setWeb3] = useState()
    const [accs, setAccs] = useState([])
    const [netId, setNetId] = useState(0)
    const [listNetwork, setListNetwork] = useState([])

    const formik = useFormik({
        initialValues: {
            exchange_rate: 0
        },
        validate
    })

    useEffect(() => {
        if (props.data) {
            console.log('edit token by admin', props.data)
            formik.setFieldValue('exchange_rate', props.data.exchange_rate)
            const nets = props.data.smartContracts.map(i => i.network.chain_id)
            // console.log('temp', temp)
            setListNetwork(nets)
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

    const onSave = async () => {
        try {
            if (!web3) {
                Swal.fire({
                    icon: 'error',
                    title: 'Not found Metamask !',
                    text: 'Plese enable Metamask !'
                })
                return
            }
            const errors = await formik.validateForm()
            if (!_.isEmpty(errors)) {
                return
            }
            let vcoin
            if (netId == 1) {
                vcoin = props.listVCoin[0]
            } else if (netId == 42) {
                vcoin = props.listVCoin[1]
            } else if (netId == 3) {
                vcoin = props.listVCoin[2]
            } else if (netId == 4) {
                vcoin = props.listVCoin[3]
            } else if (netId == 5) {
                vcoin = props.listVCoin[4]
            } else {
                vcoin = props.listVCoin[5]
            }

            const { account } = vcoin
            // console.log('account create vcoin', account)

            if (account != accs[0]) {
                Swal.fire({
                    icon: 'error',
                    title: 'Account metamask not match !',
                    text: `Please switch network to ${listNetwork.join(',')} on Metamask !`
                })
                return
            }
            props.setLoading(true)
            const chainId = getNetType(netId)
            // console.log('chain Id', chainId)
            const smartContract = props.data.smartContracts.find(i => i.network.chain_id == chainId)
            if (!smartContract) {
                Swal.fire({
                    icon: 'error',
                    title: 'No token for this network !',
                    text: `Please use account ${account} !`
                })
                return
            }
            // console.log('find smart contract', smartContract)
            const {address, abi} = smartContract

            // console.log('abi', JSON.parse(abi))
            const transaction = new web3.eth.Contract(JSON.parse(abi), address).methods.setExchangeRate(formik.values.exchange_rate)
            await sendWithEstimateGas(transaction, accs[0])
            const res = await props.updateToken({id: props.data.id, exchange_rate: formik.values.exchange_rate})
            if (!res.code) {
                throw new Error(res)
            }
            props.onClose()
            props.getListToken()
            toast.success('Edit token success')
            props.setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error('Edit token fail')
            props.setLoading(false)
        }
    }

    return <Modal

        toggle={props.onClose}
        isOpen={props.visible}>
        <ModalHeader toggle={props.onClose}>
            Edit Token
        </ModalHeader>
        <ModalBody>

            <div className="">ID: {props?.data?.id}</div>
            <div className="">Token symbol: {props?.data?.symbol}</div>
            <div className="mb-1">Token on network {listNetwork.join(',')}</div>
            <div className="">
                Exchange rate (%):
            </div>
            <Input
                invalid={formik.touched.exchange_rate && formik.errors.exchange_rate}
                name="exchange_rate"
                placeholder="Exchange rate"
                type="number"
                value={formik.values.exchange_rate}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
            />
            {formik.touched.exchange_rate && formik.errors.exchange_rate && <div className="error-text">{formik.errors.exchange_rate}</div>}
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
    updateToken,
    getListToken
}
const mapStateToProps = state => {
    return {

        listVCoin: state.vcoin.listVCoin,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditToken)