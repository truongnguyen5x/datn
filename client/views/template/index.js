
import React, { useState } from 'react'
import { Button, Row, Col, Card, CardBody } from 'reactstrap'
import CreateUpdateTemplate from './CreateUpdateTemplate'
import { Plus } from 'react-feather'
const TemplateToken = (props) => {
    const [showModalCreate, openModalCreate] = useState(false)
    const onCloseModalCreate = () => {
        openModalCreate(!showModalCreate)
    }
    return <React.Fragment>

        <Button.Ripple className="my-1 bg-gradient-primary" onClick={() => onCloseModalCreate()}>

            <Plus size={14} />
            <span className="align-middle ml-50">Tạo Template token</span>
        </Button.Ripple>
        <Row>
            <Col md={3}>
                <Card>
                    <CardBody>
                        <h5>Template token name</h5>
                        <p className="mb-0">Author: By Pixinvent Creative Studio</p>
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
                    <CardBody>
                        <h5>Template token name</h5>
                        <p className="mb-0">Author: By Pixinvent Creative Studio</p>
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
                    <CardBody>
                        <h5>Template token name</h5>
                        <p className="mb-0">Author: By Pixinvent Creative Studio</p>
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
                    <CardBody>
                        <h5>Template token name</h5>
                        <p className="mb-0">Author: By Pixinvent Creative Studio</p>
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
                    <CardBody>
                        <h5>Template token name</h5>
                        <p className="mb-0">Author: By Pixinvent Creative Studio</p>
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
                    <CardBody>
                        <h5>Template token name</h5>
                        <p className="mb-0">Author: By Pixinvent Creative Studio</p>
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
                    <CardBody>
                        <h5>Template token name</h5>
                        <p className="mb-0">Author: By Pixinvent Creative Studio</p>
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
                    <CardBody>
                        <h5>Template token name</h5>
                        <p className="mb-0">Author: By Pixinvent Creative Studio</p>
                        <div className="text-center">
                            <Button.Ripple className="mt-2" color="primary" outline>
                                Detail
                        </Button.Ripple>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <CreateUpdateTemplate
            visible={showModalCreate}
            onClose={() => onCloseModalCreate()}

        />
    </React.Fragment>
}





export default TemplateToken