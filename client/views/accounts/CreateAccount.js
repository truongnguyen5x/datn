import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button, FormGroup, Row, Col } from "reactstrap"
import { Plus, ArrowLeft, X } from 'react-feather'
import { getListAccount, createAccount } from "../../redux/actions/account/index"
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "react-toastify/dist/ReactToastify.css"
import "../../assets/scss/pages/account.scss"
import { toast, ToastContainer } from "react-toastify"

const FormSchema = Yup.object().shape({
    name: Yup.string()
        .required("Required"),
    key: Yup.string()
        .matches(/^(0x){0,1}[\w]{64}$/g, "Private key wrong format")
        .required("Required"),
})

const CreateAccount = (props) => {

    useEffect(() => {

    }, [])

    const onSubmit = async (value) => {
        const res = await props.createAccount(value);
        if (res.code) {
            toast.success("Create success !")
            props.getListAccount()
            props.onClose()
        } else {
            toast.error("Create unsuccessfully !")
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
                <h4 className="mb-0">Import Account</h4>
            </div>
            <div className="m-2">
                <Row>
                    <Col md={6} sm={12}>
                        <Formik
                            initialValues={{ name: "", key: "" }}
                            validationSchema={FormSchema}
                            onSubmit={onSubmit}
                        >
                            {() => <Form>
                                <FormGroup>
                                    <label htmlFor="name">Name</label>
                                    <Field
                                        autoComplete="off"
                                        className="form-control"
                                        name="name"
                                        placeholder="Account's name"
                                        type="text"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="field-error text-danger"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor="key">Private key</label>
                                    <Field
                                        autoComplete="off"
                                        className="form-control"
                                        name="key"
                                        placeholder="Private key"
                                        type="text"
                                    />
                                    <ErrorMessage
                                        name="key"
                                        component="div"
                                        className="field-error text-danger"
                                    />
                                </FormGroup>
                                <Button
                                    type="submit"
                                    color="primary"
                                >Add
                        </Button>
                            </Form>}
                        </Formik>

                    </Col>
                    <Col md={6} sm={12}>
                    </Col>
                </Row>
            </div>
        </div>
        <ToastContainer />
    </React.Fragment>
}

const mapDispatchToProps = {
    getListAccount,
    createAccount
}

export default connect(null, mapDispatchToProps)(CreateAccount)