
import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Card, CardBody } from 'reactstrap'
import CreateUpdateTemplate from './CreateUpdateTemplate'
import { Plus } from 'react-feather'
import { connect } from "react-redux"
import { getListTemplateToken } from '../../redux/actions/template-token'
const TemplateToken = (props) => {
    const [openModalCreate, showModalCreate] = useState(false)
    const [templateToken, setTemplateToken] = useState()
    const onCloseModalCreate = () => {
        showModalCreate(!openModalCreate)
    }
    useEffect(() => {
        props.getListTemplateToken()

    }, []);
    const { listTemplateToken } = props
    return <React.Fragment>

        <Button.Ripple className="my-1 bg-gradient-primary" onClick={() => { onCloseModalCreate(); setTemplateToken(null) }}>

            <Plus size={14} />
            <span className="align-middle ml-50">Create Template token</span>
        </Button.Ripple>
        <Row>
            {
                listTemplateToken.map(i => <Col md={3} key={i.id}>
                    <Card>
                        <CardBody>
                            <h5>{i.name}</h5>
                            <p className="mb-0">Description: {i.description}</p>
                            <div className="text-center">
                                <Button.Ripple className="mt-2" color="primary" outline onClick={() => { onCloseModalCreate(); setTemplateToken(i) }}>
                                    Detail
                            </Button.Ripple>
                            </div>
                        </CardBody>
                    </Card>
                </Col>)
            }

        </Row>
        <CreateUpdateTemplate
            visible={openModalCreate}
            onClose={() => onCloseModalCreate()}
            data={templateToken}
        />
    </React.Fragment>
}



const mapStateToProps = state => {
    return {
        listTemplateToken: state.templateToken.listTemplateToken
    }
}

export default connect(mapStateToProps, { getListTemplateToken })(TemplateToken)