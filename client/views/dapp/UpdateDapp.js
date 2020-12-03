
import React, { useEffect, useState, useRef } from 'react'
import { Button, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { connect } from 'react-redux'
import { updateDapp, getListDapp } from '../../redux/actions/dapp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ValidateSchema = Yup.object().shape({
    name: Yup.string()
        .required("Required").min(2, "Must be longer than 2 characters"),
    description: Yup.string()
        .required("Required"),
    code: Yup.string()
        .required("Required")
})

const UpdateDapp = (props) => {
    const formRef = useRef()


    const initData = props.data || { name: "", description: "", code: "" }

    const renderButton = () => {

        return <><Button color="primary" type="button" onClick={() => formRef.current.submitForm()}>
            Save
             </Button>
        </>

    }

    const renderTitleModal = () => {

        return "Update DAPP"

    }

    const onDeleteDapp = async () => {
        try {
            const res = await props.deleteDapp(props.data.id)
            if (!res.code) {
                toast.error("Error")
                return
            }
            toast.success("Success!")
            props.onClose()
            props.getListDapp()
        } catch (error) {
            toast.error("Error")
        }
    }
    const onFormSubmit = async (e) => {
        try {
            let res = await props.updateDapp(e)

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
    updateDapp,
    getListDapp,
}


export default connect(null, mapDispatchToProps)(UpdateDapp)