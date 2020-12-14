import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button, Card, Row, Col, Input, FormGroup, Label } from "reactstrap"
import { Plus, Edit, Save, Download } from 'react-feather'
import Sidebar from "react-sidebar"
import { getListVCoin, updateConfig, updateVCoin, exportSDK } from "../../redux/actions/vcoin/index"
import { getProfile } from "../../redux/actions/auth/loginActions"
import "../../assets/scss/pages/vcoin.scss"
import { saveAs } from 'file-saver'


const ListVCoin = (props) => {

    const [privateKey, setPrivateKey] = useState("")
    const [data, setData] = useState()
    const [isEditAccount, setEditAccount] = useState(false)
    const [dataContractAdd, setDataContractAdd] = useState([])

    useEffect(() => {
        props.getProfile()
        props.getListVCoin()
            .then(res => {
                if (res.code) {
                    setData(res.data)
                    const temp = res.data.address.map(i => {
                        return i.vcoins?.[0]?.address || ""
                    })
                    setDataContractAdd(temp)
                } else {
                }
            })
    }, [])

    const handleEditAccount = () => {
        setEditAccount(true)
    }

    const onChangePrivateKey = (e) => {
        setPrivateKey(e.target.value)
    }

    const onUpdatePrivateKey = async () => {
        const res = await props.updateConfig([{ key: "KEY_ADMIN", value: privateKey }])
        if (res.code) {
            const res2 = await props.getListVCoin()
            if (res2.code) {
                setData(res2.data)
            }
            setEditAccount(false)
        } else {

        }
    }

    const onChangeContractAddress = async (e, idx) => {
        dataContractAdd[idx] = e.target.value
        setDataContractAdd([...dataContractAdd])
    }

    const onSaveContractAddress = async (idx) => {
        const res = await props.updateVCoin({
            network: data.address[idx].id,
            address: dataContractAdd[idx]
        })
        if (res.code) {
            const res2 = await props.getListVCoin()
            if (res2.code) {
                setData(res2.data)
            }
        }
    }
    const onDownloadSDK = async () => {
        const res = await props.exportSDK()
        console.log(res, res.data)
        const blob = new Blob([res.data], {
            type: 'application/octet-stream'
        })
        const filename = 'download.zip'
        saveAs(blob, filename)
    }

    return <div className="vcoin-application">
        <h3>Config VCoin</h3>
        <Row>
            <Col md={6}>
                <Card className="p-1">
                    <div className="d-flex address-admin">
                        <div className="font-weight-bold address-admin-title" >Admin address</div>
                        <span>{data?.address_account}</span>
                    </div>
                    <div className="d-flex">
                        {isEditAccount ? <>
                            <div className="enter-key">
                                <Input
                                    placeholder="Enter private key"
                                    type="text"
                                    value={privateKey}
                                    onChange={onChangePrivateKey}
                                />
                            </div>

                            <Button
                                className="btn"
                                onClick={onUpdatePrivateKey}
                                color="primary"
                            >
                                <Save size={15} />
                                <span className="align-middle ml-50">Save</span>
                            </Button>
                        </> : <Button
                            color="primary"
                            onClick={handleEditAccount}
                        >
                                <Edit size={15} />
                                <span className="align-middle ml-50">Edit</span>
                            </Button>}

                    </div>
                </Card>
            </Col>
            {data?.address?.map((i, idx) => <Col md={6} key={i.id}>
                <Card className="p-1"><FormGroup>
                    <Label >VCoin on {i.name}</Label>
                    <Input
                        type="text"
                        value={dataContractAdd[idx]}
                        onChange={(e) => onChangeContractAddress(e, idx)} />
                </FormGroup>
                    <div className="d-flex">
                        <Button
                            className="btn"
                            onClick={() => onSaveContractAddress(idx)}
                            color="primary"
                        >
                            <Save size={15} />
                            <span className="align-middle ml-50">Save</span>
                        </Button>
                    </div>

                </Card>
            </Col>)}

        </Row>
        <h3>Download SDK Vcoin</h3>
        <div className="d-flex">
            <Button

                onClick={onDownloadSDK}
                color="primary"
            >
                <Download size={15} />
                <span className="align-middle ml-50">Download</span>
            </Button>

        </div>
    </div>
}

const mapDispatchToProps = {
    getListVCoin,
    getProfile,
    updateConfig,
    updateVCoin,
    exportSDK
}

const mapStateToProps = state => {
    return {
        listVCoin: state.vcoin.listVCoin
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListVCoin)