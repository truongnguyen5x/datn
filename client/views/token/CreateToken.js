
import React, { useEffect, useState, useRef } from 'react'
import { Button, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap'
import Select from "react-select"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { connect } from 'react-redux'
import { createToken, getListToken } from '../../redux/actions/token'
import { getListTemplateToken } from "../../redux/actions/template-token"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ValidateSchema = Yup.object().shape({
    name: Yup.string()
        .required("Required").min(2, "Must be longer than 2 characters"),
    symbol: Yup.string()
        .length(3, "Token symbol must have 3 character")
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

const CreateToken = (props) => {
    const [formDisable, setFormDisable] = useState(false)
    const formRef = useRef()
    useEffect(() => {
        setFormDisable(!!props.data)
    }, [props.data])

    useEffect(() => {
        props.getListTemplateToken()
    }, [])


    const renderButton = () => {
        return <Button color="primary" type="submit">
            Create
            </Button>
    }


    const renderTitleModal = () => {
        return "Create token"
    }

    const onFormSubmit = async (e) => {
        try {
            const res = await props.createToken(e)
            if (!res.code) {
                toast.error("Error")
                return
            } 
            await props.getListToken()
            props.onClose()
            toast.success("Success!")
        } catch (error) {
            toast.error("Error")
        }
    }

    const options = props.listTemplateToken.map((i, idx) => {
        return {
            value: idx,
            label: i.name
        }
    })

    const onTemplateChange = (e) => {
        const { value } = e
        const template = props.listTemplateToken[value]
        console.log("🚀 ~ file: CreateToken.js ~ line 75 ~ onTemplateChange ~ template", template)

        formRef.current.setFieldValue('code', template.code)
    }

    return <React.Fragment>
        <ToastContainer />
        <Modal
            onClosed={() => setFormDisable(!!props.data)}
            isOpen={props.visible}
            toggle={props.onClose}
            className={props.className + " modal-dialog-centered modal-lg"}
        >
            <Formik
                initialValues={{
                    name: "",
                    symbol: "",
                    description: "",
                    transaction_fee: 0,
                    exchange_rate: 0,
                    code: ""
                }}
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
                                    disabled={formDisable}
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
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="symbol">Symbol:</Label>
                                        <Field
                                            className={`form-control ${errors.symbol &&
                                                touched.symbol &&
                                                "is-invalid"}`}
                                            disabled={formDisable}
                                            type="text"
                                            name="symbol"
                                            placeholder="Token's symbol"
                                        />
                                        <ErrorMessage
                                            name="symbol"
                                            component="div"
                                            className="field-error text-danger"
                                        />
                                    </FormGroup>

                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="exchange_rate">Exchange Rate:</Label>
                                        <Field
                                            className={`form-control ${errors.exchange_rate &&
                                                touched.exchange_rate &&
                                                "is-invalid"}`}
                                            disabled={formDisable}
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

                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="transaction_fee">Transaction Fee:</Label>
                                        <Field
                                            className={`form-control ${errors.transaction_fee &&
                                                touched.transaction_fee &&
                                                "is-invalid"}`}
                                            disabled={formDisable}
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

                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="description">Description:</Label>
                                <Field
                                    name="description"
                                    className={`form-control`}
                                    disabled={formDisable}
                                    type="text"
                                    placeholder="Token's description"
                                />
                            </FormGroup>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="template">Select one template:</Label>
                                        <Select name="template" options={options} onChange={onTemplateChange} />
                                    </FormGroup>

                                </Col>
                                <Col md={6}>

                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="code">Code solidity:</Label>
                                <Field
                                    className={`form-control ${errors.code &&
                                        touched.code &&
                                        "is-invalid"}`}
                                    disabled={formDisable}
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
    createToken,
    getListToken,
    getListTemplateToken
}

const mapStateToProps = state => {
    return {
        listTemplateToken: state.templateToken.listTemplateToken
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateToken)