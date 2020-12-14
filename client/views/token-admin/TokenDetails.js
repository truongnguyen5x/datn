import React, { useState, useEffect } from "react"
import { ArrowLeft } from "react-feather"
import { getTokenById, createRequest, cancelRequest, acceptRequest, denyRequest } from "../../redux/actions/token"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { Plus, Download, Trash, X, Check } from 'react-feather'
import { Nav, NavItem, NavLink, TabPane, TabContent, Row, Col, Button, UncontrolledTooltip } from 'reactstrap'
import classnames from "classnames"
import noImage from "../../assets/img/coin/no-image.png"
import moment from "moment"
import { Edit } from 'react-feather'

const TokenDetails = props => {
  const [activeTab, setActiveTab] = useState(1)
  const [data, setData] = useState()

  useEffect(() => {
    if (props.data) {
      props.getTokenById({ id: props.data.id, type: "pending" })
        .then(res => {
          if (res.code) {
            setData(res.data)
          }
        })
    }
  }, [props.data])

  const toggle = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const handleAddVChain = async (id) => {
    const res = await props.acceptRequest({
      id
    })
    if (res.code) {
      console.log(res.data)
      props.getTokenById({ id: props.data.id, type: "pending" })
        .then(res => {
          if (res.code) {
            setData(res.data)
          }
        })
    } else {
      console.log('error')
    }
  }

  const handleCancelVChain = async (id) => {
    const res = await props.denyRequest({ id })
    if (res.code) {
      console.log(res.data)
      props.getTokenById({ id: props.data.id, type: "pending" })
        .then(res => {
          if (res.code) {
            setData(res.data)
          }
        })
    } else {
      console.log('error')
    }
  }

  const renderButtonAction = (i) => {


    return <React.Fragment>
      <Button size="sm" id={"remove"+i.id} color="success" onClick={() => handleAddVChain(i.id)}>
        <Check size={14} />
      </Button>
      <UncontrolledTooltip target={"remove"+i.id}>
        Accept
            </UncontrolledTooltip>

      <Button size="sm" id={"add"+i.id} color="danger" className="ml-1" onClick={() => handleCancelVChain(i.id)}>
        <X size={14} />
      </Button>
      <UncontrolledTooltip target={"add"+i.id}>
        Reject request
          </UncontrolledTooltip>
    </React.Fragment>
  }

  const renderListContract = () => {
    if (!data) {
      return <div className="no-results show">
        <h5>No Items Found</h5>
      </div>
    }
    return data.smartContracts.map((i, idx) => <li key={i.id} className="">
      <div>
        <div>
          Id: {i.id}
        </div>
        <div>
          Address: {i.address}
        </div>
      </div>
      <div>
        <div>
          Network: {i.network.name}
        </div>
        <div>
          Created at: {moment(i.createdAt).format("hh:mm DD/MM/YYYY")}
        </div>
      </div>
      <div>
        {renderButtonAction(i)}
      </div>
    </li>)
  }
  return (
    <div
      className={`email-app-details ${props.currentStatus ? "show" : ""
        }`}
    >
      <div className="email-detail-header">
        <div className="email-header-left d-flex align-items-center mb-1">
          <ArrowLeft
            size={20}
            className="mr-1 cursor-pointer"
            onClick={() => {
              props.handleTokenDetails("close")
            }}
          />
          <h4 className="mb-0">Detail Token</h4>
        </div>
      </div>
      <div className="m-1">


        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === 1
              })}
              onClick={() => {
                toggle(1)
              }}
            >
              General Infomation
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === 2
              })}
              onClick={() => {
                toggle(2)
              }}
            >
              List deployed contract
          </NavLink>
          </NavItem>


        </Nav>
        <TabContent className="py-50" activeTab={activeTab}>
          <TabPane tabId={1}>
            <div className="token-detail-general-wp">
              <div className="d-flex justify-content-center mb-5">
                <div className="avatar avatar-xl ">
                  <img src={data?.image || noImage} alt="avatarImg" />
                </div>
              </div>
              <Row className="mb-1 mx-0 token-detail-general-wp1">
                <Col md={6}>
                  <div className="token-detail-general">
                    <div className="font-weight-bold token-detail-title">Token symbol</div>
                    <div>{data?.symbol}</div>
                  </div>
                  <div className="token-detail-general">
                    <div className="font-weight-bold token-detail-title">Description</div>
                    <div>{data?.description || "empty"}</div>
                  </div>
                  <div className="token-detail-general">
                    <div className="font-weight-bold token-detail-title">Name</div>
                    <div>{data?.name || "empty"}</div>
                  </div>
                  <div className="token-detail-general">
                    <div className="font-weight-bold token-detail-title">Created at</div>
                    <div>{moment(data?.createdAt).format("hh:mm DD/MM/YYYY")}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="token-detail-general">
                    <div className="font-weight-bold token-detail-title">Exchange rate</div>
                    <div>{data?.exchange_rate ? `${data.exchange_rate} %` : `empty`}</div>
                  </div>
                  <div className="token-detail-general">
                    <div className="font-weight-bold token-detail-title">Transaction fee</div>
                    <div>{data?.transaction_fee ? `${data.transaction_fee} %` : `empty`}</div>
                  </div>

                </Col>
              </Row>
            </div>
          </TabPane>
          <TabPane tabId={2}>

            <PerfectScrollbar
              className="token-contract-list list-group"
              options={{
                wheelPropagation: false
              }}
            >
              <ul className="token-contract-list-wrapper">
                {renderListContract()}
              </ul>
            </PerfectScrollbar>

          </TabPane>

        </TabContent>

      </div>

    </div>
  )

}
const mapStateToProps = state => {
  return {

  }
}
const mapDispatchToProps = {
  getTokenById,
  createRequest,
  cancelRequest,
  acceptRequest,
  denyRequest
}
export default connect(mapStateToProps, mapDispatchToProps)(TokenDetails)
