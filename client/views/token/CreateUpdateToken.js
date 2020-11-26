
import React from 'react'
import { Button, Input, Label, Card, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import BreadCrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import { Plus } from 'react-feather'
import Select from "react-select"
const CreateUpdateToken = (props) => {

    const options = [
        { value: 'template 2', label: 'Template 2' },
        { value: 'template 1', label: 'Template 1' },
        { value: 'template 3', label: 'Template 3' },
        { value: 'template 4', label: 'Template 4' }
    ]
    return <React.Fragment>
        <Modal
            isOpen={props.visible}
            toggle={props.onClose}
            className={props.className + " modal-dialog-centered modal-lg"}
        >
            <ModalHeader toggle={props.onClose}>
                Tạo token
          </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="email">Tên token:</Label>
                    <Input
                        type="text"
                        id="name"
                        placeholder="Tên template"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="email">Kí hiệu token:</Label>
                    <Input
                        type="text"
                        id="short_name"
                        placeholder="Tên template"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="email">Chọn 1 template:</Label>
                    <Select options={options} />
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
                <Button color="primary" >
                    Deploy
            </Button>{" "}
            </ModalFooter>
        </Modal>

    </React.Fragment>
}





export default CreateUpdateToken