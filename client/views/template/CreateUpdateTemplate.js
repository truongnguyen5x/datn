
import React from 'react'
import { Button, Input, Label, Card, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import BreadCrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { Plus } from 'react-feather'
const CreateUpdateTemplate = (props) => {
    return <React.Fragment>
        <Modal
            isOpen={props.visible}
            toggle={props.onClose}
            className={props.className + " modal-dialog-centered modal-lg"}
        >
            <ModalHeader toggle={props.onClose}>
                Tạo Template token
          </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="email">Tên template:</Label>
                    <Input
                        type="text"
                        id="name"
                        placeholder="Tên template"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Code solidity:</Label>
                    <Input
                        rows={15}
                        type="textarea"
                        id="code"
                        placeholder="Code solidity"
                    />
                </FormGroup>
            </ModalBody>

            <ModalFooter>
                <Button color="danger" onClick={props.onClose}>
                    Cancel
            </Button>{" "}
                <Button color="primary" >
                    Create
            </Button>{" "}
            </ModalFooter>
        </Modal>

    </React.Fragment>
}





export default CreateUpdateTemplate