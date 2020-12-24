import React, { useEffect, useState } from "react"
import { Card, CardBody, CardHeader, Row, Col, Button } from 'reactstrap'
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { getProfile } from "../../redux/actions/auth/loginActions"
import { getListToken, setModalOpen, changeFilter } from "../../redux/actions/token-admin"
import TokenDetails from "./TokenDetails"

import noImage from "../../assets/img/coin/no-image.png"

const TokenList = props => {
  const [token, setToken] = useState()
  useEffect(() => {
    props.getProfile()
    props.setModalOpen('')
    props.changeFilter('pending')
  }, [])

  const handleTokenDetails = (token) => {
    setToken(token)
    props.setModalOpen("detail")
  }

  const renderMails = () => {
    if (!props.listToken.length) {
      return <div className="no-results show">
        <span>No Items Found</span>
      </div>
    }
    return props.listToken.map((i, idx) => {
      return <Col md={3} key={i.id} className="">
        <Card>
          <CardHeader className="mx-auto">
            <div className="avatar mr-1 avatar-xl">
              <img src={i.image || noImage} alt="avatarImg" />
            </div>
          </CardHeader>
          <CardBody className="text-center">
            <h4>{i.symbol}</h4>
            <p>{i.name ? `Name: ${i.name}` : `No name`}</p>
            <p>{i.description ? `Description: ${i.description}` : `No description`}</p>
            <Button
              className=" bg-gradient-primary"
              onClick={() => handleTokenDetails(i)}
            >
              Detail
            </Button>
          </CardBody>
        </Card>

      </Col>

    })
  }

  return (
    <div className="content-right">
      <div className="token-app-area">
        <div className="token-app-list-wrapper">
          <div className="token-app-list">
            <PerfectScrollbar
              className="token-user-list list-group p-1"
              options={{
                wheelPropagation: false
              }}
            >
              <div className="users-list-wrapper media-list">
                <Row>
                  {renderMails()}
                </Row>
              </div>
            </PerfectScrollbar>
          </div>
        </div>
        <TokenDetails
          data={token}
        />

      </div>
    </div>
  )

}
const mapStateToProps = state => {
  return {
    listToken: state.tokenAdmin.listToken
  }
}
const mapDispatchToProps = {
  getProfile,
  getListToken,
  setModalOpen,
  changeFilter
}
export default connect(mapStateToProps, mapDispatchToProps)(TokenList)
