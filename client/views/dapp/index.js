
import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Card, CardBody, CardHeader } from 'reactstrap'
import CreateDapp from './CreateDapp'
import DetailDapp from './DetailDapp'
import { Plus } from 'react-feather'
import { connect } from "react-redux"
import { getListDapp } from '../../redux/actions/dapp'
import avatarImg from "../../assets/img/coin/ether.png"

const Dapp = (props) => {
    const [openModalCreate, showModalCreate] = useState(false)
    const [openModalDetail, showModalDetail] = useState(false)
    const [dapp, setDapp] = useState()
    const onCloseModalCreate = () => {
        showModalCreate(!openModalCreate)
    }
    const onCloseModalDetail = () => {
        showModalDetail(!openModalDetail)
    }
    useEffect(() => {
        props.getListDapp()
    }, []);

    const { listDapp } = props
    return <React.Fragment>

        <Button.Ripple className="my-1 bg-gradient-primary" onClick={() => { onCloseModalCreate(); setDapp(null) }}>

            <Plus size={14} />
            <span className="align-middle ml-50">Create Dapp</span>
        </Button.Ripple>
        <Row>
            {
                listDapp.map(i => <Col md={3} key={i.id}>
                    <Card>
                        <CardHeader className="mx-auto">
                            <div className="avatar mr-1 avatar-xl">
                                <img src={avatarImg} alt="avatarImg" />
                            </div>
                        </CardHeader>
                        <CardBody className="text-center">
                            <h5>{i.name}</h5>
                            <p className="mb-0">Description: {i.description}</p>
                            <div className="text-center">
                                <Button.Ripple className="mt-2" color="primary" outline onClick={() => { onCloseModalDetail(); setDapp(i) }}>
                                    Detail
                            </Button.Ripple>
                            </div>
                        </CardBody>
                    </Card>
                </Col>)
            }

        </Row>
        <CreateDapp
            visible={openModalCreate}
            onClose={() => onCloseModalCreate()}
        />
        <DetailDapp
            visible={openModalDetail}
            onClose={() => onCloseModalDetail()}
            data={dapp}
        />
    </React.Fragment>
}



const mapStateToProps = state => {
    return {
        listDapp: state.dapp.listDapp
    }
}

export default connect(mapStateToProps, { getListDapp })(Dapp)