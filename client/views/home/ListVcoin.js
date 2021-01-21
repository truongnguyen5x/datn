import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { connect } from "react-redux"
import { ToastContainer } from 'react-toastify'
import { Button, Card, Col, Row } from "reactstrap"
import "../../assets/scss/pages/vcoin.scss"
import { getProfile } from "../../redux/actions/auth/loginActions"
import { getListVCoin } from "../../redux/actions/vcoin/index"
import { getNetType } from '../../utility/web3'
import CreateVCoin from './CreateVcoin'
import DetailVcoin from './DetailVcoin'
import Swal from 'sweetalert2'

const ListVCoin = (props) => {

    const [modalCreate, openModalCreate] = useState(false)
    const [modalDetail, openModalDetail] = useState(false)
    const [vcoin, setVcoin] = useState(false)

    useEffect(() => {
        props.getListVCoin()
    }, [])


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
                                onClick={() => {
                                    openModalDetail(true)
                                    setVcoin(i)
                                }}
                                color="primary"
                            >
                                <Edit size={15} />
                                <span className="align-middle ml-50">Detail</span>
                            </Button>
                        </div>
                    </Card>
                </Col> : null)}
            </Row>

            <div className="full-width d-flex align-items-center flex-direction-column">

                <Button type="success"
                    color='danger'
                    onClick={() => {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: "If deploy new V-Coin you must re-add the tokens to it",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, continue!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                openModalCreate(true)
                            }
                        })
                    }}
                >
                    Deploy a V-Coin
                 </Button>

            </div>
            <CreateVCoin
                visible={modalCreate}
                onClose={() => openModalCreate(false)}
            />
            <DetailVcoin
                data={vcoin}
                visible={modalDetail}
                onClose={() => {
                    openModalDetail(false)
                }}
            />
        </div>
        <ToastContainer />
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