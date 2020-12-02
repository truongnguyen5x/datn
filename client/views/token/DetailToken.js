
import React, { useEffect, useState, useRef } from 'react'
import { Button, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap'
import Select from "react-select"
import { Formik, Field, Form, ErrorMessage } from "formik"
import UpdateToken from "./UpdateToken"
import { connect } from 'react-redux'
import { deleteToken, getListToken } from '../../redux/actions/token'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'react-bootstrap-sweetalert'

const DetailToken = (props) => {
    const [openModalUpdate, showModalUpdate] = useState(false)
    const [isConfirmDelete, setConfirmDelete] = useState(false)
    const onCloseModalUpdate = () => {
        showModalUpdate(!openModalUpdate)
    }
    const renderButton = () => {
        return <><Button color="primary" type="button" onClick={() => { onCloseModalUpdate(); props.onClose() }}>
            Update
                </Button>{" "}<Button color="danger" onClick={() => setConfirmDelete(true)} type="button">
                Delete
                </Button>{" "}
        </>
    }

    const renderTitleModal = () => {

        return "Detail token"

    }

    const onDeleteToken = async () => {
        try {
            await props.deleteToken(props.data.id)
            toast.success("Success!")
            props.onClose()
            props.getListToken()
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
            >
                {propsForm =>
                    <Form>
                        <ModalHeader toggle={props.onClose}>
                            {renderTitleModal()}
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="name">Name:</Label>
                                <Field
                                    className={`form-control`}
                                    disabled
                                    type="text"
                                    name="name"
                                    placeholder="Token's name"
                                />
                            </FormGroup>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="symbol">Symbol:</Label>
                                        <Field
                                            className={`form-control`}
                                            disabled
                                            type="text"
                                            name="symbol"
                                            placeholder="Token's symbol"
                                        />
                                    </FormGroup>

                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="exchange_rate">Exchange Rate:</Label>
                                        <Field
                                            className={`form-control`}
                                            disabled
                                            type="number"
                                            name="exchange_rate"
                                            placeholder="Token's exchange rate"
                                        />
                                    </FormGroup>

                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="transaction_fee">Transaction Fee:</Label>
                                        <Field
                                            className={`form-control`}
                                            disabled
                                            type="number"
                                            name="transaction_fee"
                                            placeholder="Token's Transaction Fee"
                                        />
                                    </FormGroup>

                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="description">Description:</Label>
                                <Field
                                    name="description"
                                    className={`form-control`}
                                    disabled
                                    type="text"
                                    placeholder="Token's description"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="code">Code solidity:</Label>
                                <Field
                                    className={`form-control`}
                                    disabled
                                    rows={15}
                                    type="text"
                                    as="textarea"
                                    name="code"
                                    placeholder="Code solidity"
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
        <UpdateToken
            data={props.data}
            visible={openModalUpdate}
            onClose={() => onCloseModalUpdate()}
        />
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
                onDeleteToken()

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
    deleteToken,
    getListToken
}

const mapStateToProps = state => {
    return {
        listTemplateToken: state.templateToken.listTemplateToken
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailToken)