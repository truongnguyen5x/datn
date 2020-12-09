import React, { useEffect, useState, useRef, useReducer } from 'react'
import { connect } from "react-redux"
import { Button, FormGroup, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Label } from "reactstrap"
import { Plus, ArrowLeft, X } from 'react-feather'
import { getListVCoin, createVCoin } from "../../redux/actions/vcoin/index"
import { getListNetwork } from "../../redux/actions/network"
import { getAccountBalance } from "../../redux/actions/account"
import Wizard from "../../components/@vuexy/wizard/WizardComponent"
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "react-toastify/dist/ReactToastify.css"
import "../../assets/scss/pages/vcoin.scss"
import { toast, ToastContainer } from "react-toastify"
import classnames from "classnames"
import Select from 'react-select'
import Editor from './Editor'
import imgEther20 from "../../assets/img/coin/ether20x20.png"

const CreateVCoin = (props) => {
    const [activeTab, setActiveTab] = useState("1")
    const [network, setNetwork] = useState()
    const [account, setAccount] = useState()
    const formRef = useRef()
    const [sourceCode, setSourceCode] = useState([])

    useEffect(() => {
        props.getListNetwork()
    }, [])

    const CustomOptionNetwork = (optionProps) => {
        const { innerRef, innerProps, data } = optionProps

        const { name, path } = data
        return <div ref={innerRef} {...innerProps} className="d-flex network-select-option">
            <div className="network-select-title font-weight-bold">{name}</div>
            <div >{path}</div>
        </div>
    }

    const validate = (value, props) => {
        const errors = {}
        // if (!value.network) {
        errors.network = "Required !"
        // }
        // console.log(errors)
        return errors
    }


    const CustomOptionAccount = (optionProps) => {
        const { innerRef, innerProps, data } = optionProps

        const { name, address, balance } = data
        return <div ref={innerRef} {...innerProps} className="d-flex account-select-option">
            <div>
                <div className="account-select-title font-weight-bold">{name}</div>
                <span >{address}</span>
            </div>
            <div className="right ont-weight-bold">
                <span>{balance}</span><img src={imgEther20} />
            </div>
        </div>
    }

    const onSelectNetwork = (value) => {
        setNetwork(value)
        props.getAccountBalance({ network_id: value.id })
    }

    const onSelectAccount = (value) => {
        setAccount(value);
    }

    const onCreateVCoin = async () => {
        const dataCreate = {
            network: network.id,
            account: account.id,
            source: sourceCode,
            contract: 'VCoin'
        }
        const res = await props.createVCoin(dataCreate)
        if (res.code) {
            toast.success("Create success!")
            props.getListVCoin()
            props.onClose()
        } else {
            toast.error("Create fail !")
            return
        }
    }

    const networkOptions = props.listNetwork.map(i => ({ ...i, value: i.id, label: i.name }))
    const accountOptions = props.listAccount.map(i => ({ ...i, value: i.id, label: i.name }))
    const contractOptions = [{ value: 'vcoin', label: "VCoin" }, { value: 'erc20', label: "ERC20" }]

    const steps = [
        {
            title: 1,
            content: <Editor onChange={e => setSourceCode(e)}/>
        }, {
            title: 2,
            content: <Row>
                <Col sm={12} md={6}>
                    <FormGroup>
                        <Label for="network">Select one contract:</Label>
                        <Field
                            name="network"
                            placeholder="Select contract"
                        >
                            {({ field, form, ...props }) => <Select
                                options={contractOptions}
                            />
                            }
                        </Field>
                    </FormGroup>
                </Col>
            </Row>
        }, {
            title: 3,
            content: <Row>
                <Col sm={12} md={6}>
                    <FormGroup>
                        <Label for="network">Select one network:</Label>
                        <Field
                            name="network"
                            placeholder="Select network"
                        >
                            {({ field, form, ...props }) => <Select
                                options={networkOptions}
                                value={network}
                                onChange={onSelectNetwork}
                                components={{ Option: CustomOptionNetwork }}
                            />
                            }
                        </Field>
                    </FormGroup>
                    <FormGroup>
                        <Label for="account">Select one account in wallets:</Label>
                        <Field
                            name="account"
                        >
                            {() => <Select
                                value={account}
                                placeholder="Select account"
                                options={accountOptions}
                                onChange={onSelectAccount}
                                components={{ Option: CustomOptionAccount }}
                            />
                            }
                        </Field>
                    </FormGroup>
                </Col>
            </Row>

        }
    ]


    return <React.Fragment>
        <div className={`vcoin-detail ${props.visible ? "show" : ""}`}>
            <div className="vcoin-detail-header">
                <X onClick={props.onClose}
                    size={20}
                    className="mr-1 cursor-pointer"
                />
                <h4 className="mb-0">Create VCoin</h4>
            </div>
            <div className="m-2 vcoin-detail-body" >
                <Formik >
                    {() => <Wizard
                        enableAllSteps
                        onFinish={onCreateVCoin}
                        steps={steps}
                    />
                    }
                </Formik>
            </div>
        </div>
        <ToastContainer />
    </React.Fragment>
}

const mapDispatchToProps = {
    getListVCoin,
    createVCoin,
    getListNetwork,
    getAccountBalance
}

const mapStateToProps = state => {
    return {
        listNetwork: state.network.listNetwork,
        listAccount: state.account.listAccount
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateVCoin)