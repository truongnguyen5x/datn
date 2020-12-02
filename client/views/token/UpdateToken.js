
import React, { useEffect, useState, useRef } from 'react'
import { Button, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Select from "react-select"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { connect } from 'react-redux'
import { updateToken, getListToken } from '../../redux/actions/token'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ValidateSchema = Yup.object().shape({
    name: Yup.string()
        .required("Required").min(2, "Must be longer than 2 characters"),
    symbol: Yup.string()
        .length(3, "Token symbol must have 3 character")
        .uppercase("Token symbol must is uppercase")
        .required("Required"),
    exchange_rate: Yup.number()
        .min(1, "Exchange Rate too small")
        .required("Required"),
    code: Yup.string()
        .required("Required"),
    transaction_fee: Yup.number()
        .min(1, "Transaction Fee too small")
        .required("Required")
})

const UpdateToken = (props) => {

    const formRef = useRef()


    const renderButton = () => {
        return <><Button color="primary" type="button" onClick={() => formRef.current.submitForm()}>
            Save
             </Button>
        </>

    }

    const renderTitleModal = () => {

        return "Update Token"

    }


    const onFormSubmit = async (e) => {
        try {

            await props.updateToken(e)

            props.onClose()
            props.getListToken()
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
                initialValues={props.data}
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
                                    placeholder="Token's name"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="field-error text-danger"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="exchange_rate">Exchange Rate:</Label>
                                <Field
                                    className={`form-control ${errors.exchange_rate &&
                                        touched.exchange_rate &&
                                        "is-invalid"}`}
                                    type="number"
                                    name="exchange_rate"
                                    placeholder="Token's exchange rate"
                                />
                                <ErrorMessage
                                    name="exchange_rate"
                                    component="div"
                                    className="field-error text-danger"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="transaction_fee">Transaction Fee:</Label>
                                <Field
                                    className={`form-control ${errors.transaction_fee &&
                                        touched.transaction_fee &&
                                        "is-invalid"}`}
                                    type="number"
                                    name="transaction_fee"
                                    placeholder="Token's Transaction Fee"
                                />
                                <ErrorMessage
                                    name="transaction_fee"
                                    component="div"
                                    className="field-error text-danger"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description:</Label>
                                <Field
                                    name="description"
                                    className={`form-control`}
                                    type="text"
                                    placeholder="Token's description"
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
    getListToken,
    updateToken
}

const mapStateToProps = state => {
    return {
        listTemplateToken: state.templateToken.listTemplateToken
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateToken)