import classnames from "classnames"
import { saveAs } from 'file-saver'
import moment from "moment"
import React, { useEffect, useState } from "react"
import { ArrowLeft, Download, Edit, Trash } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { Button, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledTooltip } from 'reactstrap'
import Swal from 'sweetalert2'
import noImage from "../../assets/img/coin/no-image.png"
import { cancelRequest, createRequest, getTokenById, setModalOpen } from "../../redux/actions/token-dev"
import { getListVCoin } from '../../redux/actions/vcoin'
import { writeBatchFile } from '../../utility/file'
import { exporSdkWorker } from '../../utility/sdk'
import { getWeb3, getNetType } from '../../utility/web3'

const TokenDetails = props => {
  const [activeTab, setActiveTab] = useState(1)
  const [data, setData] = useState()
  const [web3, setWeb3] = useState()
  const [netId, setNetId] = useState(0)
  const [accs, setAccs] = useState([])

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

    const interfaceX = JSON.parse(i.abi)
    let vcoin
    if (netId == 1) {
      vcoin = props.listVCoin[0]
    } else if (netId == 2) {
      vcoin = props.listVCoin[1]
    } else if (netId == 3) {
      vcoin = props.listVCoin[2]
    } else {
      vcoin = props.listVCoin[3]
    }

    const myContract = new web3.eth.Contract(interfaceX, i.address)
    myContract.methods.setVChain(vcoin.address)
      .send({
        from: accs[0],
        gas: 500000
      })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash)
      })
      .on('receipt', async (receipt) => {
        console.log('receipt', receipt)
        const res = await props.createRequest({
          id: i.id
        })
        props.getTokenById(props.data.id)
          .then(res => {
            if (res.code) {
              setData(res.data)
            }
          })
      })
      .on('error', async err => {
        console.log('error')
      });




  }

  const handleCancelVChain = async (id) => {
    const res = await props.cancelRequest({ id })
    if (res.code) {
      props.getTokenById(props.data.id)
        .then(res => {
          if (res.code) {
            setData(res.data)
          }
        })
    } else {
      console.log('error')
    }
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
        <Button size="sm" id={"remove" + i.id} color="danger" onClick={() => handleCancelVChain(i.id)}>
          <Trash size={14} />
        </Button>
      </React.Fragment>
    }
    else {
      return <React.Fragment>
        <Button size="sm" id={"add" + i.id} color="success" onClick={() => handleAddVChain(i)}>
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '15px' }}></i>
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
          Status: {i?.request?.accepted ? "on VChain" : "not on Vchain"}
        </div>
      </div>
      <div>
        <div>
          Network: {getNetType(i.network_id)}
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
              List deployed contract
          </NavLink>
          </NavItem>


        </Nav>
        <TabContent className="py-50" activeTab={activeTab}>
          <TabPane tabId={1}>


            <Row className="mb-1 mx-0 token-detail-general-wp">
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
                <div className="token-detail-general">
                  <div className="font-weight-bold token-detail-title">Exchange rate</div>
                  <div>{data?.exchange_rate ? `${data.exchange_rate} %` : `empty`}
                    <Button
                      outline
                      size="sm"
                      color="primary"
                      className="ml-1"
                      onClick={() => {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Not implement !'
                        })
                      }}
                    >
                      <Edit size={12} />
                    </Button>
                  </div>
                </div>
                <div className="token-detail-general">
                  <div className="font-weight-bold token-detail-title">On Vchain</div>
                  <div>None</div>
                </div>
              </Col>
              <Col md={6}>
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
  getListVCoin
}
export default connect(mapStateToProps, mapDispatchToProps)(TokenDetails)
