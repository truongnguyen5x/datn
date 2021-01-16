import { useFormik } from 'formik'
import React, { useEffect, useState } from "react"
import { Edit } from 'react-feather'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import Upload from '../../components/Upload'
import { setLoading } from '../../redux/actions/home'
import { getListToken, updateToken, uploadImage } from '../../redux/actions/token-dev'





const EditToken = props => {

    const [listNetwork, setListNetwork] = useState([])

    const formik = useFormik({
        initialValues: {
            description: "",
            image: ""
        }
    })

    useEffect(() => {
        if (props.data) {
            console.log('edit token by dev', props.data)
            const { description, image } = props.data
            formik.setValues({ description, image })
            const nets = props.data.smartContracts.map(i => i.network.chain_id)
            setListNetwork(nets)
        }
    }, [props.data])



    const onSave = async () => {
        try {
            const { image, description } = formik.values
            if (image.name) {
                const formData = new FormData()
                formData.append('image', image)
                // console.log(formData)
                const res = await props.uploadImage(formData)
                if (!res.code) {
                    throw new Error()
                }
                const res2 = await props.updateToken({
                    id: props.data.id,
                    image: res.data,
                    description
                })
                if (!res2.code) {
                    throw new Error()
                }
            } else {
                const res2 = await props.updateToken({
                    id: props.data.id,
                    description
                })
                if (!res2.code) {
                    throw new Error()
                }
            }
            props.onClose()
            props.getListToken()
            toast.success('Edit token success')
            props.setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error('Edit token fail')
            props.setLoading(false)
        }
    }

    return <Modal

        toggle={props.onClose}
        isOpen={props.visible}>
        <ModalHeader toggle={props.onClose}>
            Edit Token
        </ModalHeader>
        <ModalBody>
            <div className="">ID: {props?.data?.id}</div>
            <div className="">Token symbol: {props?.data?.symbol}</div>
            <div className="mb-1">Token on network {listNetwork.join(',')}</div>
            <div className="">
                Desciption:
            </div>
            <Input
                name="description"
                placeholder="Description"
                type="text"
                value={formik.values.description}
                onChange={formik.handleChange}
            />
            <div className="d-flex justify-content-center mt-2">
                <Upload
                    image={formik.values.image}
                    onChange={image => formik.setFieldValue('image', image)}
                />
            </div>
            <div className="text-center">
                <span className="">Upload image for token</span>
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={onSave}>
                <Edit size={15} />
                Save
                    </Button>{" "}
        </ModalFooter>
    </Modal>
}

const mapDispatchToProps = {
    setLoading,
    updateToken,
    getListToken,
    uploadImage
}
const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditToken)