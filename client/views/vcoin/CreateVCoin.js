import React, { useEffect, useState, useRef, useReducer } from 'react'
import { connect } from "react-redux"
import { Button, FormGroup, Row, Col } from "reactstrap"
import { Plus, ArrowLeft, X } from 'react-feather'
import { getListVCoin, createVCoin } from "../../redux/actions/vcoin/index"
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "react-toastify/dist/ReactToastify.css"
import "../../assets/scss/pages/vcoin.scss"
import { toast, ToastContainer } from "react-toastify"

const FormSchema = Yup.object().shape({
    name: Yup.string()
        .required("Required"),
    key: Yup.string()
        .matches(/^(0x){0,1}[a-fA-F_0-9]{64}$/g, "Private key wrong format")
        .required("Required"),
})

const CreateVCoin = (props) => {
    const formRef = useRef()
    useEffect(() => {

    }, [])

    const onSubmit = async (value , {resetForm}) => {
        const res = await props.createVCoin(value);
        if (res.code) {
            toast.success("Create success !")
            formRef.current.setFieldValue
            props.getListVCoin()
            props.onClose()
            resetForm({})
        } else {
            toast.error("Create unsuccessfully !")
            return
        }
    }

    return <React.Fragment>
        <div className={`vcoin-detail ${props.visible ? "show" : ""}`}>
            <div className="vcoin-detail-header">
                <X onClick={props.onClose}
                    size={20}
                    className="mr-1 cursor-pointer"
                />
                <h4 className="mb-0">Create VCoin</h4>
            </div>
            <div className="m-2">
                <Row>
                    <Col md={6} sm={12}>
                        <Formik
                            innerRef={formRef}
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
    getListVCoin,
    createVCoin
}

export default connect(null, mapDispatchToProps)(CreateVCoin)