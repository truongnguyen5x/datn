
import React, { useEffect, useState, useRef } from 'react'
import { Button, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import Select from "react-select"
import { connect } from 'react-redux'
import { updateDapp, getListDapp } from '../../redux/actions/dapp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getListToken } from '../../redux/actions/token'


const ValidateSchema = Yup.object().shape({
    name: Yup.string()
        .required("Required").min(2, "Must be longer than 2 characters"),
    description: Yup.string()
        .required("Required")
})

const UpdateDapp = (props) => {
    const formRef = useRef()

    const tokenOption = props.listToken.map(i => ({ value: i.symbol, label: i.symbol }))

    const [selectedTokens, setTokens] = useState([])
    useEffect(() => {
        props.getListToken()
    }, [])

    useEffect(() => {
        if (props.listToken.length > 0) {
            setTokens([props.listToken[0].symbol])
        }
    }, [props.listToken])

    useEffect(() => {
        if (props.data) {
            // console.log(props.data)
            setTokens(props.data.Tokens.map(i => i.symbol))
        }
    }, [props.data])

    const initData = props.data || { name: "", description: "" }



    const onChangeToken = (e) => {
        const temp = (e || []).map(i => i.value)
        setTokens(temp)
        formRef.current.setFieldValue("tokens", temp)
    }

    const renderButton = () => {

        return <><Button color="primary" type="button" onClick={() => formRef.current.submitForm()}>
            Save
             </Button>
        </>

    }

    const renderTitleModal = () => {

        return "Update DAPP"

    }

    const onFormSubmit = async (e) => {
        try {
            const { name, description } = e
            const sendData = { name, description, tokens: selectedTokens, id: props.data.id }
            let res = await props.updateDapp(sendData)

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
    updateDapp,
    getListDapp,
    getListToken
}


const mapStateToProps = state => {
    return {
        listToken: state.token.listToken
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(UpdateDapp)