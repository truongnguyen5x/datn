
import React, { useEffect, useState, useRef } from 'react'
import { Button, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap'
import Select from "react-select"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { connect } from 'react-redux'
import { createDapp, getListDapp, getTemplateDapp } from '../../redux/actions/dapp'
import { getListToken } from '../../redux/actions/token'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'react-bootstrap-sweetalert'

const ValidateSchema = Yup.object().shape({
    name: Yup.string()
        .required("Required").min(2, "Must be longer than 2 characters"),
    description: Yup.string()
        .required("Required"),
    code: Yup.string()
        .required("Required")
})

const CreateDapp = (props) => {
    const formRef = useRef()
    const tokenOption = props.listToken.map(i => ({ value: i.symbol, label: i.symbol }))


    const [selectedTokens, setTokens] = useState([])

    const initData = {
        name: "",
        description: "",
        code: props.listTemplateDapp?.[0]?.code || "",
    }

    const renderButton = () => {
        return <Button color="primary" type="submit">
            Create
            </Button>
    }

    useEffect(() => {
        props.getTemplateDapp()
        props.getListToken()
    }, [])

    useEffect(() => {
        if (props.listToken.length > 0) {
            setTokens([props.listToken[0].symbol])
        }
    }, [props.listToken])


    const renderTitleModal = () => {
        return "Create DAPP"
    }


    const onFormSubmit = async (e) => {
        try {
            e.tokens = selectedTokens
            const res = await props.createDapp(e)
            if (!res.code) {
                toast.error("Error")
                return
            }
            props.onClose()
            props.getListDapp()
            toast.success("Success!")
        } catch (error) {
            toast.error("Error")
        }
    }

    const onChangeToken = (e) => {
        const temp = (e || []).map(i => i.value)
        setTokens(temp)
        formRef.current.setFieldValue("tokens", temp)
    }

    return <React.Fragment>
        <ToastContainer />
        <Modal
            isOpen={props.visible}
            toggle={props.onClose}
            className={props.className + " modal-dialog-centered modal-lg"}
        >
            <Formik
                initialValues={initData}
                validationSchema={ValidateSchema}
                onSubmit={onFormSubmit}
                innerRef={formRef}
            >
                {({ errors, touched }) =>
                    <Form>
                        <ModalHeader toggle={props.onClose}>
                            {renderTitleModal()}
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="name">Name:</Label>
                                <Field
                                    className={`form-control ${errors.name &&
                                        touched.name &&
                                        "is-invalid"}`}

                                    type="text"
                                    name="name"
                                    placeholder="DAPP's name"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="field-error text-danger"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="list_token">List token:</Label>
                                <Select
                                    value={tokenOption.filter(i => selectedTokens.includes(i.value))}
                                    isMulti
                                    options={tokenOption}
                                    className="React"
                                    classNamePrefix="select"
                                    onChange={onChangeToken}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description:</Label>
                                <Field
                                    name="description"
                                    className={`form-control ${errors.description &&
                                        touched.description &&
                                        "is-invalid"}`}
                                    type="text"
                                    placeholder="DAPP's description"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="field-error text-danger"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="code">Code solidity:</Label>
                                <Field
                                    className={`form-control ${errors.code &&
                                        touched.code &&
                                        "is-invalid"}`}
                                    rows={15}
                                    type="text"
                                    as="textarea"
                                    name="code"
                                    placeholder="Code solidity"
                                />
                                <ErrorMessage
                                    name="code"
                                    component="div"
                                    className="field-error text-danger"
                                />
                            </FormGroup>

                        </ModalBody>

                        <ModalFooter>
                            {renderButton()}
                        </ModalFooter>
                    </Form>
                }

            </Formik>
        </Modal>

    </React.Fragment>
}


const mapDispatchToProps = {
    createDapp,
    getListDapp,
    getTemplateDapp,
    getListToken
}

const mapStateToProps = state => {
    return {
        listTemplateDapp: state.dapp.listTemplateDapp,
        listToken: state.token.listToken
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateDapp)