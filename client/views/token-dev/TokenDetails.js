import classnames from "classnames"
import { saveAs } from 'file-saver'
import moment from "moment"
import React, { useEffect, useState } from "react"
import { ArrowLeft, Download, Edit, Trash } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { Button, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import noImage from "../../assets/img/coin/no-image.png"
import { cancelRequest, createRequest, getTokenById, setModalOpen, getListToken } from "../../redux/actions/token-dev"
import { getListVCoin } from '../../redux/actions/vcoin'
import { writeBatchFile, clearAll } from '../../utility/file'
import { exporSdkWorker } from '../../utility/sdk'
import { getWeb3, getNetType, sendWithEstimateGas } from '../../utility/web3'
import { toast } from "react-toastify"

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

  const handleAddToVCoin = async (i) => {
    setLoading(true)
    setClicked(i.id)
    const interfaceX = JSON.parse(i.abi)
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
    if (!vcoin) {
      Swal.fire({
        icon: 'Error',
        title: 'Not found VCoin for this network !',
        text: 'Plese contact Admin !'
      })
      setLoading(false)
      return
    }
    if (i.address) {
      if (!web3) {
        Swal.fire({
          icon: 'Error',
          title: 'Not found Metamask !',
          text: 'Plese enable Metamask !'
        })
        setLoading(false)
        return
      }
      if (i.account != accs[0]) {
        Swal.fire({
          icon: 'Error',
          title: 'Account metamask not match !',
          text: `Please use account ${i.account} !`
        })
        setLoading(false)
        return
      }
      const myContract = new web3.eth.Contract(interfaceX, i.address)
      const transaction = myContract.methods.setVChain(vcoin.address)
      sendWithEstimateGas(transaction, accs[0])
        .then(async () => {
          const res = await props.createRequest({
            id: i.id
          })
          props.getTokenById(props.data.id)
            .then(res => {
              if (res.code) {
                setData(res.data)
                toast.success('Created request add token to V-Coin')
              }
              setLoading(false)
            })
        })
        .catch(error => {
          console.log(error)
          setLoading(false)
        })
    } else {
      const res = await props.createRequest({
        id: i.id
      })
      props.getTokenById(props.data.id)
        .then(res => {
          if (res.code) {
            setData(res.data)
            toast.success('Created request add token to V-Coin')

          }
          setLoading(false)
        })
    }
  }

  const handleCancelVCoin = async (id) => {
    setLoading(true)
    setClicked(id)
    const res = await props.cancelRequest({ id })
    if (res.code) {
      props.getListToken()
      props.getTokenById(props.data.id)
        .then(res => {
          if (res.code) {
            if (res.data) {
              setData(res.data)
            } else {
              props.setModalOpen('')
            }
            toast.success('Removed request add token to VCoin')
          }
          setLoading(false)
        })
    } else {
      console.log('error')
    }
    setLoading(false)
  }

  const handleDownloadSdk = async (i) => {
    const zip = exporSdkWorker(data.symbol, i.account, i.address, i.network_id, JSON.parse(i.abi), data.owner.name)
    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        saveAs(content, `${data.symbol}.zip`);
      });

  }


  const handleOpenSourceCode = (i) => {
    // console.log(i)
    clearAll()
    writeBatchFile(i.files)
    window.open("/ide", "_blank")
  }

  const renderButtonAction = (i) => {
    if (i?.request?.accepted) {
      return null
    }
    if (i?.request) {
      return <React.Fragment>
        <UncontrolledTooltip target={"remove" + i.id}>
          Cancel add request
            </UncontrolledTooltip>
        <Button size="sm" id={"remove" + i.id} color="danger" onClick={() => handleCancelVCoin(i.id)}>
          {(loading && clicked == i.id) ? <Spinner color="white" size="sm" />
            : <Trash size={14} />}
        </Button>
      </React.Fragment>
    }
    else {
      return <React.Fragment>
        <Button size="sm" id={"add" + i.id} color="success" onClick={() => handleAddToVCoin(i)}>
          {(loading && clicked == i.id)
            ? <Spinner color="white" size="sm" />
            : <i className="fas fa-cloud-upload-alt" style={{ fontSize: '15px' }}></i>}
        </Button>
        <UncontrolledTooltip target={"add" + i.id}>
          Add to VChain
          </UncontrolledTooltip>
      </React.Fragment>
    }
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
        <Button size="sm" id="sdk" color="primary" className="ml-1"
          onClick={() => handleDownloadSdk(i)}
        >
          <Download size={14} />
        </Button>
        <UncontrolledTooltip target="sdk">
          Download SDK
            </UncontrolledTooltip>
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
              resetState()
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
                  <div>{data?.exchange_rate ? `1 ${data?.symbol} = ${(data.exchange_rate / 100.0).toFixed(2)} Vcoin` : `empty`}
                  </div>
                </div>
                <div className="token-detail-general">
                  <div className="font-weight-bold token-detail-title">Total supply</div>
                  <div>{parseInt(data?.initial_supply || 0).toLocaleString()}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="d-flex justify-content-center mb-5 flex-direction-column align-items-center">
                  <div>
                    <div className="avatar mr-1 avatar-xl">
                      <img src={data?.image || noImage} alt="avatarImg" />
                    </div>
                  </div>
                  <h5>Upload token image</h5>
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
    modalOpen: state.tokenDev.modalOpen
  }
}
const mapDispatchToProps = {
  getTokenById,
  createRequest,
  cancelRequest,
  setModalOpen,
  getListVCoin,
  getListToken
}
export default connect(mapStateToProps, mapDispatchToProps)(TokenDetails)
