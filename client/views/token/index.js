
import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Card, CardBody, CardHeader } from 'reactstrap'
import CreateToken from './CreateToken'
import DetailToken from "./DetailToken"
import { connect } from "react-redux"
import { Plus, Check } from 'react-feather'
import avatarImg from "../../assets/img/coin/ether.png"
import { getListToken } from '../../redux/actions/token'
const Token = (props) => {
    const [openModalCreate, showModalCreate] = useState(false)
    const [openModalDetail, showModalDetail] = useState(false)
    const [token, setToken] = useState()
    const onCloseModalCreate = () => {
        showModalCreate(!openModalCreate)
    }
    const onCloseModalDetail = () => {
        showModalDetail(!openModalDetail)
    }
    useEffect(() => {
        props.getListToken()

    }, []);
    const { listToken } = props
    return <React.Fragment>

        <Button.Ripple className="my-1 bg-gradient-primary" onClick={() => { onCloseModalCreate(); setToken(null) }}>
            <Plus size={14} />
            <span className="align-middle ml-50">Create token</span>
        </Button.Ripple>
        <Row>
            {
                listToken.map(i => <Col md={3}>
                    <Card>
                        <CardHeader className="mx-auto">
                            <div className="avatar mr-1 avatar-xl">
                                <img src={avatarImg} alt="avatarImg" />
                            </div>
                        </CardHeader>
                        <CardBody className="text-center">
                            <h4>{i.symbol}</h4>
                            <p className="mb-0">{i.name}</p>
                            <p className="mb-0">Description: {i.description}</p>
                            <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                            <div className="text-center">
                                <Button.Ripple className="mt-2" color="primary" outline onClick={() => { onCloseModalDetail(); setToken(i) }}>
                                    Detail
                            </Button.Ripple>
                            </div>
                        </CardBody>
                    </Card>
                </Col>)
            }

        </Row>
        <CreateToken
            visible={openModalCreate}
            onClose={() => onCloseModalCreate()}
        />
        <DetailToken
            data={token}
            visible={openModalDetail}
            onClose={() => onCloseModalDetail()}
        />
    </React.Fragment>
}



const mapStateToProps = state => {
    return {
        listToken: state.token.listToken
    }
}

export default connect(mapStateToProps, { getListToken })(Token)