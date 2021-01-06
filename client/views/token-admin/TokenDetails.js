import classnames from "classnames"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { ArrowLeft, Check, Trash, X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { Button, Col, Nav, NavItem, NavLink, Row, Spinner, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap'
import { acceptRequest, deleteToken, denyRequest, getListToken, getTokenById, setModalOpen } from "../../redux/actions/token-admin"
import { getListVCoin } from '../../redux/actions/vcoin'
import { clearAll, writeBatchFile } from '../../utility/file'
import { getWeb3, deployWithEstimateGas, sendWithEstimateGas } from '../../utility/web3'


const TokenDetails = props => {
  const [activeTab, setActiveTab] = useState(1)
  const [data, setData] = useState()
  const [web3, setWeb3] = useState()
  const [netId, setNetId] = useState(0)
  const [accs, setAccs] = useState([])
  const [loading, setLoading] = useState(false)
  const [clicked, setClicked] = useState(0)

  useEffect(() => {
    props.getListVCoin()
    if (props.data) {
      props.getTokenById(props.data.id)
        .then(res => {
          if (res.code) {
            setData(res.data)
          }
        })
    }
  }, [props.data])

  const resetState = () => {
    setActiveTab(1)
  }

  useEffect(() => {
    getWeb3()
      .then(res => {
        setWeb3(res)
        getInfo(res)
      })
      .catch(err => console.log(err))
  }, [])

  const getInfo = async (web3) => {
    web3.eth.getAccounts().then(listAcc => {
      setAccs(listAcc)
    })
    web3.eth.net.getId().then(netId => setNetId(netId))
  }

  const toggle = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const handleAddVChain = async (i) => {
    setLoading(true)
    setClicked(i.id)

    let vcoin
    if (netId == 1) {
      vcoin = props.listVCoin[0]
    } else if (netId == 42) {
      vcoin = props.listVCoin[1]
    } else if (netId == 3) {
      vcoin = props.listVCoin[2]
    } else if (netId == 4) {
      vcoin = props.listVCoin[3]
    } else if (netId == 5) {
      vcoin = props.listVCoin[4]
    } else {
      vcoin = props.listVCoin[5]
    }
    if (!web3) {
      Swal.fire({
        icon: 'Error',
        title: 'Not found Metamask !',
        text: 'Plese enable Metamask !'
      })
      setLoading(false)
      return
    }
    if (vcoin.account != accs[0]) {
      Swal.fire({
        icon: 'Error',
        title: 'Account metamask not match !',
        text: `Please use account ${i.account} !`
      })
      setLoading(false)
      return
    }
    const interfaceX = JSON.parse(vcoin.abi)
    const vcoinContract = new web3.eth.Contract(interfaceX, vcoin.address)
    if (i.address) {
      const trans = vcoinContract.methods.addToken(i.address)
      sendWithEstimateGas(trans, accs[0])
        .then(async () => {
          const res = await props.acceptRequest({
            id: i.id
          })
          setLoading(false)
          props.getListToken()
          resetState()
          props.getTokenById(props.data.id)
            .then(res => {
              if (res.code) {
                if (res.data) {
                  setData(res.data)
                } else {
                  props.setModalOpen('')
                }
              }
            })
        })
        .catch(error => {
          console.log(error)
          setLoading(false)
        })
    } else {
      let smartContractAddress
      let newInstance
      const token = new web3.eth.Contract(JSON.parse(i.abi))
      const deploy = token.deploy({
        data: i.bytecode,
        arguments: JSON.parse(i.constructor_data)
      })
      deployWithEstimateGas(deploy, accs[0])
        .then(instance => {
          smartContractAddress = instance.options.address
          newInstance = instance
          const setInfo = instance.methods.setInfo(data.symbol, data.name, data.initial_supply)
          return sendWithEstimateGas(setInfo, accs[0])
        })
        .then(() => {
          const setVcoin = newInstance.methods.setVChain(vcoin.address)
          return sendWithEstimateGas(setVcoin, accs[0])
        })
        .then(() => {
          const addToken = vcoinContract.methods.addToken(smartContractAddress)
          return sendWithEstimateGas(addToken, accs[0])
        })
        .then(async () => {
          const res = await props.acceptRequest({
            id: i.id,
            address: smartContractAddress
          })
          setLoading(false)
          props.getListToken()
          resetState()
          props.getTokenById(props.data.id)
            .then(res => {
              if (res.code) {
                if (res.data) {
                  setData(res.data)
                } else {
                  props.setModalOpen('')
                }
              }
            })
        })
        .catch(error => {
          console.log(error)
        })

    }

  }

  const handleDenyVChain = async (id) => {
    setLoading(true)
    setClicked(id)
    const res = await props.denyRequest({ id })
    if (res.code) {
      resetState()
      props.getListToken()
      props.getTokenById(props.data.id)
        .then(res => {
          if (res.code) {
            if (res.data) {
              setData(res.data)
            } else {
              props.setModalOpen('')
            }
          }
          setLoading(false)
        })
    } else {
      console.log('error')
    }
    setLoading(false)
  }


  const handleDeleteToken = async (i) => {


    setLoading(true)
    setClicked(i.id)

    let vcoin
    if (netId == 1) {
      vcoin = props.listVCoin[0]
    } else if (netId == 42) {
      vcoin = props.listVCoin[1]
    } else if (netId == 3) {
      vcoin = props.listVCoin[2]
    } else if (netId == 4) {
      vcoin = props.listVCoin[3]
    } else if (netId == 5) {
      vcoin = props.listVCoin[4]
    } else {
      vcoin = props.listVCoin[5]
    }
    if (vcoin.account != accs[0]) {
      Swal.fire({
        icon: 'Error',
        title: 'Account metamask not match !',
        text: `Please use account ${i.account} !`
      })
      setLoading(false)
      return
    }
    const interfaceX = JSON.parse(vcoin.abi)
    const myContract = new web3.eth.Contract(interfaceX, vcoin.address)
    const removeTk = myContract.methods.removeToken(data.symbol)
    sendWithEstimateGas(removeTk, accs[0])
      .then(async () => {
        const res = await props.deleteToken(i.id)
        props.getListToken()
        resetState()
        setLoading(false)
        props.getTokenById(props.data.id)
          .then(res => {
            if (res.code) {
              if (res.data) {
                setData(res.data)
              } else {
                props.setModalOpen('')
              }
            }
          })
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const handleOpenSourceCode = (i) => {
    clearAll()
    writeBatchFile(i.files)
    window.open("/ide", "_blank")
  }

  const renderButtonAction = (i) => {
    if (props.listType == "in-vchain") {
      return <React.Fragment>
        <Button size="sm" id={"add" + i.id} color="danger" className="ml-1" onClick={() => handleDeleteToken(i)}>
          {(loading && clicked == i.id) ? <Spinner color="white" size="sm" /> : <Trash size={14} />}
        </Button>
        <UncontrolledTooltip target={"add" + i.id}>
          Delete from vcoin
          </UncontrolledTooltip>

      </React.Fragment>
    }

    return <React.Fragment>
      <Button size="sm" id={"remove" + i.id} color="success" onClick={() => handleAddVChain(i)}>
        {(loading && clicked == i.id) ? <Spinner color="white" size="sm" /> : <Check size={14} />}
      </Button>
      <UncontrolledTooltip target={"remove" + i.id}>
        Accept
            </UncontrolledTooltip>

      <Button size="sm" id={"add" + i.id} color="danger" className="ml-1" onClick={() => handleDenyVChain(i.id)}>
        <X size={14} />
      </Button>
      <UncontrolledTooltip target={"add" + i.id}>
        Reject request
          </UncontrolledTooltip>
    </React.Fragment>
  }

  const renderListContract = () => {
    if (!data) {
      return <div className="no-results show">
        <span>No Items Found</span>
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
        <div>
          Status: {i?.request?.accepted ? "on VCoin" : "not on VCoin"}
        </div>
      </div>
      <div>
        <div>
          Network: {i?.network?.chain_id}
        </div>
        <div>
          Created at: {moment(i.createdAt).format("hh:mm DD/MM/YYYY")}
        </div>
      </div>
      <div>
        {renderButtonAction(i)}
        <Button size="sm" id="code" color="primary" className="ml-1"
          onClick={() => handleOpenSourceCode(i)}>
          <i className="fas fa-code" style={{ fontSize: '15px' }}></i>
        </Button>
        <UncontrolledTooltip target="code">
          View source code
            </UncontrolledTooltip>
      </div>
    </li>)
  }
  return (
    <div
      className={`token-app-details ${props.modalOpen == 'detail' ? "show" : ""
        }`}
    >
      <div className="token-detail-header">
        <div className="token-header-left d-flex align-items-center mb-1">
          <ArrowLeft
            size={20}
            className="mr-1 cursor-pointer"
            onClick={() => {
              props.setModalOpen("")
            }}
          />
          <h4 className="mb-0">Detail Token</h4>
        </div>
      </div>
      <div className="m-1">


        <Nav tabs className="justify-content-center">
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
              List smart contract
          </NavLink>
          </NavItem>


        </Nav>
        <TabContent className="py-50" activeTab={activeTab}>
          <TabPane tabId={1}>


            <Row className="mb-1 mx-0 token-detail-general-wp">
              <Col md={9}>
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
                <div className="token-detail-general">
                  <div className="font-weight-bold token-detail-title">Exchange rate</div>
                  <div>{data?.exchange_rate ? `1 ${data.symbol} = ${(data.exchange_rate / 100.0).toFixed(2)} VCoin` : `empty`}  </div>
                </div>
                <div className="token-detail-general">
                  <div className="font-weight-bold token-detail-title">Total supply</div>
                  <div>{parseInt(data?.initial_supply || 0).toLocaleString()}</div>
                </div>
              </Col>
            </Row>

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
    listVCoin: state.vcoin.listVCoin,
    modalOpen: state.tokenAdmin.modalOpen,
    listType: state.tokenAdmin.listType,
  }
}
const mapDispatchToProps = {
  getTokenById,
  setModalOpen,
  getListVCoin,
  acceptRequest,
  denyRequest,
  deleteToken,
  getListToken
}
export default connect(mapStateToProps, mapDispatchToProps)(TokenDetails)
