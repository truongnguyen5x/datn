
import React, { useEffect, useState, useRef } from 'react'
import { Button, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { connect } from 'react-redux'
import { createTemplateToken, updateTemplateToken, deleteTemplateToken, getListTemplateToken } from '../../redux/actions/template-token'
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

const CreateUpdateTemplate = (props) => {
    const [formDisable, setFormDisable] = useState(false)
    const [isConfirmDelete, setConfirmDelete] = useState(false)
    const formRef = useRef()
    useEffect(() => {
        setFormDisable(!!props.data)
    }, [props.data])

    const editedMode = !!props.data
    const initData = props.data || { name: "", description: "", code: "" }

    const renderButton = () => {
        if (!editedMode) {
            return <Button color="primary" type="submit">
                Create
            </Button>
        } else if (formDisable) {
            return <><Button color="primary" type="button" onClick={() => setFormDisable(false)}>
                Update
                </Button>{" "}<Button color="danger" onClick={() => setConfirmDelete(true)} type="button">
                    Delete
                </Button>{" "}
            </>
        } else {
            return <><Button color="primary" type="button" onClick={() => formRef.current.submitForm()}>
                Save
             </Button>
            </>
        }
    }

    const renderTitleModal = () => {
        if (!editedMode) {
            return "Create Template token"
        } else if (formDisable) {
            return "Detail Template token"
        } else {
            return "Update Template Token"
        }
    }

    const onDeleteTemplateToken = async () => {
        try {
            const res = await props.deleteTemplateToken(props.data.id)
            if (!res.code) {
                toast.error("Error")
                return
            }
            toast.success("Success!")
            props.onClose()
            props.getListTemplateToken()
        } catch (error) {
            toast.error("Error")
        }
    }
    const onFormSubmit = async (e) => {
        try {
            let res
            if (editedMode) {
                res = await props.updateTemplateToken(e)
            } else {
                res = await props.createTemplateToken(e)
            }
            if (!res.code) {
                toast.error("Error")
                return
            }
            props.onClose()
            props.getListTemplateToken()
            toast.success("Success!")
        } catch (error) {
            toast.error("Error")
        }
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
                                    disabled={formDisable}
                                    type="text"
                                    name="name"
                                    placeholder="Template's name"
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
                                    disabled={formDisable}
                                    type="text"
                                    placeholder="Template's description"
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
        <SweetAlert title="Are you sure?"
            warning
            show={isConfirmDelete}
            showCancel
            reverseButtons
            cancelBtnBsStyle="danger"
            confirmBtnText="Yes, delete it!"
            cancelBtnText="Cancel"
            onConfirm={() => {
                setConfirmDelete(false)
                onDeleteTemplateToken()

            }}
            onCancel={() => {
                setConfirmDelete(false)
            }}
        >
            You won't be able to revert this!
        </SweetAlert>
    </React.Fragment>
}


const mapDispatchToProps = {
    createTemplateToken,
    getListTemplateToken,
    updateTemplateToken,
    deleteTemplateToken
}


export default connect(null, mapDispatchToProps)(CreateUpdateTemplate)