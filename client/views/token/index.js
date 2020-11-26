
import React, { useState } from 'react'
import { Button, Row, Col, Card, CardBody, CardHeader } from 'reactstrap'
import BreadCrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import avatarImg from "../../assets/img/coin/ether.png"
import CreateUpdateToken from './CreateUpdateToken'
import { Plus, Check } from 'react-feather'
const Token = (props) => {
    const [showModalCreate, openModalCreate] = useState(false)
    const onCloseModalCreate = () => {
        openModalCreate(!showModalCreate)
    }
    return <React.Fragment>
        <Button.Ripple className="my-1 bg-gradient-primary" onClick={()=>onCloseModalCreate()}>

            <Plus size={14} />
            <span className="align-middle ml-50">Tạo token</span>
        </Button.Ripple>
        <Row>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md={3}>
                <Card>
                    <CardHeader className="mx-auto">
                        <div className="avatar mr-1 avatar-xl">
                            <img src={avatarImg} alt="avatarImg" />
                        </div>
                    </CardHeader>
                    <CardBody className="text-center">
                        <h4>TKN1</h4>
                        <p className="mb-0">Token 1</p>
                        <p className="mb-0">Owner: Admin</p>
                        <p className="mb-0 success"><Check /> <span className="mt-1">Deployed</span>  </p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <CreateUpdateToken
            visible={showModalCreate}
            onClose={() => onCloseModalCreate()}

        />
    </React.Fragment>
}





export default Token