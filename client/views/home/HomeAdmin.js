import React, { useEffect, useState } from 'react'
import { Download } from 'react-feather'
import { connect } from "react-redux"
import { Button, Card, Col, Row } from "reactstrap"
import "../../assets/scss/pages/vcoin.scss"
import { getProfile } from "../../redux/actions/auth/loginActions"
import { getListVCoin } from "../../redux/actions/vcoin/index"
import CreateVCoin from './CreateToken'
import { getNetType } from '../../utility/web3'



const ListVCoin = (props) => {

    const [modalCreate, openModalCreate] = useState(false)

    useEffect(() => {
        props.getProfile()
        props.getListVCoin()

    }, [])


    const onDownloadSDK = async (i) => {

    }



    return <div className="vcoin-application">
        <div className="content-right">
            <h3>Config VCoin</h3>

            <Row>
                {props.listVCoin.map((i, idx) => i ? <Col md={6} key={i.id}>
                    <Card className="p-1">
                        <div className="mb-1">VCoin on network {getNetType(i.network_id)}</div>
                        <div>Address: {i.address}</div>
                        <div>Account: {i.account}</div>
                        <div className="d-flex justify-content-between mt-1">
                            <Button
                                // onClick={() => onDownloadSDK(i.vcoins[0].id)}
                                color="primary"
                            >
                                <Download size={15} />
                                <span className="align-middle ml-50">Download SDK</span>
                            </Button>
                        </div>
                    </Card>
                </Col> : null)}
            </Row>

            <div className="full-width d-flex align-items-center flex-direction-column">

                <Button type="success"
                    onClick={() => openModalCreate(true)}
                >
                    Deploy a V-Coin
                 </Button>

            </div>
            <CreateVCoin
                visible={modalCreate}
                onClose={() => openModalCreate(false)}
            />
        </div>

    </div>
}

const mapDispatchToProps = {
    getListVCoin,
    getProfile
}

const mapStateToProps = state => {
    return {
        listVCoin: state.vcoin.listVCoin
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListVCoin)