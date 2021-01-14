import classnames from "classnames"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { ArrowLeft, Box, Folder, Layers } from "react-feather"
import { connect } from "react-redux"
import Select from 'react-select'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import {
  Button, Col, Input, Nav,
  NavItem,
  NavLink, Row,



  Spinner, TabContent,
  TabPane
} from "reactstrap"
import Swal from 'sweetalert2'
import "../../assets/scss/plugins/extensions/editor.scss"
import "../../assets/scss/plugins/extensions/toastr.scss"
import { getConfig } from "../../redux/actions/token-dev"
import { createVcoin, getListVCoin, testDeploy, validateSource } from '../../redux/actions/vcoin'
import { clearAll, readBatchFile, writeOneFile } from '../../utility/file'
import { getNetType, getWeb3, deployWithEstimateGas } from '../../utility/web3'




const CreateVcoin = props => {

  const [sourceCode, setSourceCode] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedContractInterface, setSelectedContractInterface] = useState()
  const [listContractInterface, setListContractInterface] = useState([])
  const [dataConstructorDeploy, setDataConstructorDeploy] = useState([])
  const [accs, setAccs] = useState([])
  const [netId, setNetId] = useState(0)
  const [balance, setBalance] = useState("")
  const [web3, setWeb3] = useState()


  useEffect(() => {
    getAndWriteTemplateCode()

    getWeb3()
      .then(res => {
        setWeb3(res)
        getInfo(res)
      })
      .catch(err => console.log(err))
  }, [])

  const resetState = () => {
    setSelectedContractInterface(null)
    setDataConstructorDeploy([])
    setActiveStep(0)
  }

  const getInfo = async (web3) => {
    web3.eth.getAccounts().then(listAcc => {
      setAccs(listAcc)
      web3.eth.getBalance(listAcc[0])
        .then(e => {
          setBalance(web3.utils.fromWei(e))
        })
    })
    web3.eth.net.getId().then(netId => {
      console.log('net id', netId)
      setNetId(netId)
    })
  }

  const getAndWriteTemplateCode = async () => {
    console.log('from vcoin')
    while (!window.remixFileSystem) {
      // console.log('loop')
      await sleep(500)
    }
    // console.log('clear', window.remixFileSystem)
    clearAll()
    props.getConfig('LIB.SOL')
      .then(res => {
        if (res.code) {
          const { value } = res.data
          writeOneFile('/Lib.sol', value)
          props.getConfig('MAIN.SOL')
            .then(res => {
              if (res.code) {
                const { value } = res.data
                writeOneFile('/Main.sol', value)
              }
            })
        }
      })
  }

  const handleNextStep = async () => {
    switch (activeStep) {
      case 0:
        checkDoneStep0()
        break;
      case 1:
        checkDoneStep1()
        break
      case 2:
        checkDoneStep2()
        break
      case 3:
        checkDoneStep3()
        break
    }

  }
  const handlePreviousStep = () => {

    setActiveStep(activeStep - 1)

  }

  const onChangeContractInterface = (e) => {

    setSelectedContractInterface(e)
    if (e?.inputs) {
      setDataConstructorDeploy(Array(e.inputs.length).fill(""))
    }
  }

  const onChangeDataConstructorDeploy = (idx, e) => {
    dataConstructorDeploy[idx] = e.target.value
    setDataConstructorDeploy([...dataConstructorDeploy])
  }

  const onCloseModal = () => {
    props.onClose()
  }
  const checkDoneStep0 = async () => {
    const source1 = readBatchFile();
    setSourceCode(source1)
    setLoading(true)
    const res = await props.validateSource(source1)
    if (res.code) {
      setListContractInterface(res.data.map((i, idx) => {
        i.label = i.file + '/' + i.contract
        i.value = idx
        return i
      }))
      setActiveStep(1)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Validate source code error, review your code again !'
      })

      // throw new Error("error")
    }
    setLoading(false)
  }

  const checkDoneStep1 = async () => {
    setLoading(true)
    if (!selectedContractInterface) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a smart contract to deploy !'
      })
      setLoading(false)
      // throw new Error()
    }
    const { abi, bytecode } = selectedContractInterface
    const res = await props.testDeploy({ abi, bytecode, constructor: dataConstructorDeploy })
    if (res.code) {
      setActiveStep(2)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your smart contract invalid !'
      })
      // throw new Error()
    }
    // console.log('1111111111')
    setLoading(false)
  }


  const checkDoneStep2 = async () => {
    setLoading(true)
    let smartContractAddress
    const myContract = new web3.eth.Contract(selectedContractInterface.abi)
    const deploy = myContract.deploy({
      data: selectedContractInterface.bytecode,
      arguments: dataConstructorDeploy
    })
    deployWithEstimateGas(deploy, accs[0])
      .then(instance => {
        return props.createVcoin({
          account: accs[0],
          network_id: netId,
          abi: selectedContractInterface.abi,
          address: instance.options.address
        })
      })
      .then(res => {
        if (res.code) {
          resetState()
          props.onClose()
          props.getListVCoin()
          toast.success("Create token success")
        } else {
          toast.error("Create token error !")
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }


  const renderConstructorDeploy = () => {
    return <div className="mt-2">
      <h5>Enter params to deploy {selectedContractInterface.label}</h5>
      {selectedContractInterface.inputs.map((i, idx) => {
        let type = "text"
        switch (i.type) {
          case "uint256":
            type = "number"
        }
        return <Input
          className="mb-1"
          type={type}
          placeholder={i.name}
          value={dataConstructorDeploy[idx]}
          onChange={e => onChangeDataConstructorDeploy(idx, e)}
        />
      })}
    </div>
  }

  const renderStepHeader = () => {
    let listNav = [<NavItem
      className="step-wrapper"
      key={0}
    // onClick={() => handleEnableAllSteps(0)}
    >
      <NavLink
        className={classnames(`step step-0`, {
          active: activeStep === 0 ? true : false,
          done: 0 < activeStep
        })}>
        <span className="step-text"><Folder size={20} /></span>
      </NavLink>
    </NavItem>, <NavItem
      className="step-wrapper"
      key={1}
    // onClick={() => handleEnableAllSteps(0)}
    >
      <NavLink
        className={classnames(`step step-1`, {
          active: activeStep === 1 ? true : false,
          done: 1 < activeStep
        })}>
        <span className="step-text"><Box size={20} /></span>
      </NavLink>
    </NavItem>, <NavItem
      className="step-wrapper"
      key={2}
    // onClick={() => handleEnableAllSteps(0)}
    >
      <NavLink
        className={classnames(`step step-2`, {
          active: activeStep === 2 ? true : false,
          done: 2 < activeStep
        })}>
        <span className="step-text"> <Layers size={20} /></span>
      </NavLink>
    </NavItem>

    ]

    return listNav
  }
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <TabPane
          className={`step-content step-0-content`}
          key={0}
          tabId={0}>

          <div className="full-height d-flex justify-content-center align-items-center ">
            <a className="d-block cursor-pointer text-center" href="/ide" target="_blank">
              <i className="far fa-file-code"></i>
              <h2> Click here to custom  </h2>
              <h2> our Token source code </h2>
              <h2> then <span className="ctrl-s">Ctrl + S</span> to save</h2>
            </a>
          </div>
        </TabPane>
      case 1:
        return <TabPane
          className={`step-content step-1-content`}
          key={1}
          tabId={1}>  <Row className="mb-2">
            <Col md={3} sm={0}></Col>
            <Col md={6} sm={12}>
              <h5>Select a smart contract</h5>
              <Select
                placeholder="Select a smart contract to deploy"
                options={listContractInterface}
                value={selectedContractInterface}
                onChange={onChangeContractInterface}
              />
              {selectedContractInterface && selectedContractInterface.inputs && renderConstructorDeploy()}
            </Col>
          </Row>
        </TabPane>

      case 2:
        return <TabPane
          className={`step-content step-2-content`}
          key={2}
          tabId={2}>  <Row className="mb-2">
            <Col md="6" sm="12">
              <h4 className="m-1">Confirm Information</h4>
              <div className="d-flex m-1">
                <div className="font-weight-bold info-title">
                  Account to deploy:
                </div>
                <div> {accs?.[0] || ""}</div>
              </div>
              <div className="d-flex m-1">
                <div className="font-weight-bold info-title">
                  Account balance:
                </div>
                <div> {balance} ETH</div>
              </div>
              <div className="d-flex m-1">
                <div className="font-weight-bold info-title">
                  Current network:
                </div>
                <div> {getNetType(netId)}</div>
              </div>
            </Col>
            <Col md="6" sm="12">
            </Col>
          </Row>
        </TabPane>

    }
  }

  return (
    <div
      className={`compose-token shadow-none ${props.visible ? "open" : ""
        }`}
    >
      <div className="compose-mail-header align-items-center">
        <div className="compose-mail-title d-flex align-items-center mb-1">
          <ArrowLeft
            size={20}
            className="mr-1 cursor-pointer"
            onClick={onCloseModal}
          />
          <h4 className="mb-0">New token</h4>
        </div>
      </div>
      <div className="ml-1 mr-1 mb-1 compose-mail-body">
        <Nav
          className={`vx-wizard`}
          tabs>
          {renderStepHeader()}
        </Nav>
        <TabContent
          className={`vx-wizard-content`}
          activeTab={activeStep}>
          {renderStepContent()}
        </TabContent>
        <div className="wizard-actions d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            disabled={activeStep === 0}
            onClick={handlePreviousStep}>
            Prev
        </Button>
          <Button
            type="button"
            color="primary"
            className='d-flex align-items-center'
            onClick={handleNextStep}
          >
            {loading ? <Spinner color="white" size="sm" /> : 3 === activeStep
              ? 'Create V-Coin'
              : "Next"
            }
          </Button>
        </div>

      </div>
    </div>
  )
}
const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = {
  getConfig,
  validateSource,
  createVcoin,
  testDeploy,
  getListVCoin
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateVcoin)
