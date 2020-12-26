import React, { useEffect, useState } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import noImage from "../../assets/img/coin/no-image.png"
import { Menu } from 'react-feather'
import { getProfile } from "../../redux/actions/auth/loginActions"
import { changeFilter, getListToken, setModalOpen } from "../../redux/actions/token-dev"
import CreateToken from "./CreateToken"
import TokenDetails from "./TokenDetails"

const TokenList = props => {
  const [token, setToken] = useState()

  useEffect(() => {
    props.getProfile()
    props.setModalOpen('')
    props.changeFilter('all')
  }, [])

  const handleTokenDetails = (token) => {
    setToken(token)
    props.setModalOpen('detail')
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
            <div style={{height: '40px'}}>
              <div
                className="d-lg-none sidebar-toggle"
                onClick={() => props.mainSidebar(true)}
              >
                <Menu size={24} />
              </div>

            </div>

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

        <CreateToken
        />
      </div>
    </div>
  )

}
const mapStateToProps = state => {
  return {
    listToken: state.tokenDev.listToken
  }
}
const mapDispatchToProps = {
  getProfile,
  getListToken,
  setModalOpen,
  changeFilter
}
export default connect(mapStateToProps, mapDispatchToProps)(TokenList)
