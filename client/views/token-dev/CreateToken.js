import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { ArrowLeft, Box, Folder, Info, Layers } from "react-feather"
import { connect } from "react-redux"
import Select from 'react-select'
import { toast } from "react-toastify"
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
import { getAccountBalance } from '../../redux/actions/account'
import { getListNetwork } from '../../redux/actions/network'
import { checkTokenSymbolExists, createToken, getConfig, getListToken, setModalOpen, testDeploy, validateSource } from "../../redux/actions/token-dev"
import { sleep } from '../../utility'
import { clearAll, readBatchFile, writeOneFile } from '../../utility/file'
import { deployWithEstimateGas, getNetType, getWeb3, sendWithEstimateGas } from '../../utility/web3'

const CreateToken = props => {

  const [sourceCode, setSourceCode] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [selectedContractInterface, setSelectedContractInterface] = useState()
  const [listContractInterface, setListContractInterface] = useState([])
  const [dataConstructorDeploy, setDataConstructorDeploy] = useState([])
  const [accs, setAccs] = useState([])
  const [netId, setNetId] = useState(0)
  const [tokenSymbol, setTokenSymbol] = useState()
  const [tokenName, setTokenName] = useState()
  const [initialSupply, setInitialSupply] = useState()
  const [existToken, setExistToken] = useState(null)
  const [balance, setBalance] = useState("")
  const [web3, setWeb3] = useState()
  const [sourceEdited, setSourceEdited] = useState(false)
  const [libSol, setLibSol] = useState('')
  const [tokenSol, setTokenSol] = useState('')
  const [useMetaMask, setUseMetaMask] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState()
  const [description, setDescription] = useState('')
  // const [contractAdd, setContractAdd] = useState("")


  useEffect(() => {
    getAndWriteTemplateCode()
    props.getListNetwork()
    // .then(res => console.log(res))
    getWeb3()
      .then(res => {
        if (res) {
          setWeb3(res)
          getInfo(res)
        }
      })
      .catch(err => console.log(err))
  }, [])

  const resetState = () => {
    setSelectedContractInterface(null)
    setDataConstructorDeploy([])
    setActiveStep(0)
    setSourceEdited(false)
    setUseMetaMask(false)
  }

  const optionNetwork = props.listNetwork.filter(i => i.type == 'http')
    .map(i => {
      i.value = i.net_id
      i.label = i.chain_id
      return i
    })

  // console.log(optionNetwork)

  const getInfo = async (web3) => {
    web3.eth.getAccounts().then(listAcc => {
      setAccs(listAcc)
      web3.eth.getBalance(listAcc[0])
        .then(e => {
          setBalance(web3.utils.fromWei(e))
        })
    })
    web3.eth.net.getId().then(netId => {
      // console.log(netId)
      setNetId(netId)
    })
    // console.log(web3.eth.accounts.wallet)
  }


  const getAndWriteTemplateCode = async () => {
    console.log('from dev')
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
          setLibSol(value)
          props.getConfig('TOKEN.SOL')
            .then(res => {
              if (res.code) {
                const { value } = res.data
                writeOneFile('/Token.sol', value)
                setTokenSol(value)
              }
            })
        }
      })
  }

  const onChangeContractInterface = (e) => {
    setSelectedContractInterface(e)
    if (e?.inputs) {
      console.log("🚀 ~ file: CreateToken.js ~ line 132 ~ onChangeContractInterface ~ e", e)
      setDataConstructorDeploy(Array(e.inputs.length).fill(""))
    }
  }


  const onChangeDataConstructorDeploy = (idx, e) => {
    console.log("🚀 ~ file: CreateToken.js ~ line 136 ~ onChangeDataConstructorDeploy ~ idx, e", idx, e)
    dataConstructorDeploy[idx] = e.target.value
    setDataConstructorDeploy([...dataConstructorDeploy])
  }
  const checkDoneStep0 = async () => {
    setLoading(true)
    const source1 = readBatchFile();
    setSourceCode(source1)
    const res = await props.validateSource(source1)

    if (res.code && res.data.length) {
      setListContractInterface(res.data.map((i, idx) => {
        i.label = i.file + '/' + i.contract
        i.value = idx
        return i
      }))

      if (source1[0].path == 'Lib.sol' && source1[0].code == libSol
        && source1[1].path == 'Token.sol' && source1[1].code == tokenSol) {
        setSourceEdited(false)
        setTokenSymbol('TK1')
        const temp = res.data.find(i => i.file == 'Token.sol')
        setSelectedContractInterface(temp)
        setDataConstructorDeploy(['1000000'])
        const { abi, bytecode } = temp
        const res1 = await props.testDeploy({ abi, bytecode, constructor: ['1000000'] })
        if (res1.code && res1.data.existToken) {
          const { name, description, initial_supply } = res1.data.existToken
          console.log("🚀 ~ file: CreateToken.js ~ line 166 ~ checkDoneStep0 ~ res.data.existToken", res.data.existToken)
          setTokenName(name)
          setDescription(description)
          setInitialSupply(initial_supply)
        } else {
          setTokenName('token1')
          setInitialSupply('1000000000000000000000000')
        }
        setActiveStep(2)
      } else {
        setSelectedContractInterface(null)
        setDataConstructorDeploy([])
        setSourceEdited(true)
        setActiveStep(1)
        Swal.fire({
          icon: 'warning',
          title: 'We compiled your code',
          text: 'Plese enter some infomation !'
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your source code error, review your code again !'
      })
      setLoading(false)

    }

    setLoading(false)
  }
  const checkDoneStep1 = async () => {
    console.log("🚀 ~ file: CreateToken.js ~ line 194 ~ checkDoneStep1 ~ dataConstructorDeploy", dataConstructorDeploy)
    setLoading(true)
    if (!selectedContractInterface) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a smart contract to deploy !'
      })
      setLoading(false)
    }
    const { abi, bytecode } = selectedContractInterface
    const res = await props.testDeploy({ abi, bytecode, constructor: dataConstructorDeploy })
    if (res.code) {
      const { data } = res
      setTokenSymbol(data.symbol)
      setExistToken(data.existToken)
      if (data.existToken) {
        const { name, description, initial_supply } = data.existToken
        setInitialSupply(initial_supply)
        setTokenName(name)
        setDescription(description)
      } else {
        setInitialSupply(data.totalSupply)
        setTokenName(data.name)
      }
      setActiveStep(2)
      setLoading(false)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your smart contract invalid !'
      })
      setLoading(false)
    }
  }

  const checkDoneStep2 = async () => {
    setLoading(true)
    if (!tokenSymbol || !tokenName || !initialSupply) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter information !'
      })
    }

    const res = await props.checkTokenSymbolExists(tokenSymbol)
    console.log("🚀 ~ file: CreateToken.js ~ line 222 ~ checkDoneStep2 ~ res", res)
    if (res.code) {
      setActiveStep(3)
      setLoading(false)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Token symbol already taken !'
      })
      setLoading(false)
    }
  }
  const checkDoneStep3 = async () => {
    setLoading(true)
    if (useMetaMask) {
      let smartContractAddress
      let newContractInstance
      const myContract = new web3.eth.Contract(selectedContractInterface.abi)
      const deploy = myContract.deploy({
        data: selectedContractInterface.bytecode,
        arguments: dataConstructorDeploy
      })
      deployWithEstimateGas(deploy, accs[0])
        .then(instance => {
          newContractInstance = instance
          smartContractAddress = instance.options.address
          const setInfo = instance.methods.setInfo(tokenSymbol, tokenName, initialSupply)
          return sendWithEstimateGas(setInfo, accs[0])
        })
        .then(() => {
          return props.createToken({
            source: sourceCode,
            chain_id: getNetType(netId),
            tokenSymbol,
            abi: selectedContractInterface.abi,
            initialSupply: initialSupply,
            tokenName,
            account: accs[0],
            description,
            address: smartContractAddress
          })
        })
        .then(res => {
          if (res.code) {
            resetState()
            props.setModalOpen("")
            props.getListToken()
            toast.success('Create token success')
            setLoading(false)
          } else {
            setLoading(false)
          }
        })
        .catch(error => {
          setLoading(false)
          console.log(error)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something error'
          })
        })
    } else {
      console.log("🚀 ~ file: CreateToken.js ~ line 259 ~ checkDoneStep3 ~ selectedNetwork", selectedNetwork)
      props.createToken({
        source: sourceCode,
        network_id: selectedNetwork.id,
        constructorData: dataConstructorDeploy,
        bytecode: selectedContractInterface.bytecode,
        tokenSymbol,
        abi: selectedContractInterface.abi,
        initialSupply: initialSupply,
        tokenName,
        description
      })
        .then(res => {
          if (res.code) {
            resetState()
            props.setModalOpen("")
            props.getListToken()
            toast.success('Create token success')
            setLoading(false)
          } else {
            setLoading(false)
          }
        })
    }
  }

  const onCloseModal = () => {
    props.setModalOpen("")
  }

  // const CustomOption = ({ innerProps, innerRef, data, ...rest }) => {
  //   // console.log(rest)
  //   return <div className="list-option-select" ref={innerRef} {...innerProps}>
  //     <div>{data.name}</div>
  //     <div>{data.path}</div>
  //   </div>
  // }

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

    // setReachedStep(Math.max(reachedStep, activeStep + 1))

    // setActiveStep(0)
    // setReachedStep(0)


  }

  const handlePreviousStep = () => {
    if (activeStep == 2 && sourceEdited == false) {
      setActiveStep(0)
    } else {
      setActiveStep(activeStep - 1)
    }
  }

  // const handleEnableAllSteps = index => {
  //   if (index < reachedStep) {
  //     setActiveStep(index)
  //   }
  //   if (index - activeStep == 1) {
  //     handleNextStep()
  //   }
  // }


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
  const renderDeployCheckBox = () => {
    if (!web3 || sourceEdited == false) return <div className="d-flex m-1">
      <div className="font-weight-bold info-title">
        Select blockchain
      </div>
      <div style={{ minWidth: '350px' }}>
        <Select
          placeholder="Select a blockchain to deploy"
          options={optionNetwork}
          value={selectedNetwork}
          onChange={e => setSelectedNetwork(e)}
        />
      </div>
    </div>
    if (useMetaMask) {
      return <React.Fragment>
        <div className="d-flex m-1">
          <div className="font-weight-bold info-title">
            Use metamask:
        </div>
          <div style={{ width: '50px', textAlign: 'center' }}>
            <Input type="checkbox" checked={useMetaMask} onClick={() => setUseMetaMask(false)} />
          </div>
        </div>
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
        </div> </React.Fragment>
    } else {
      return <React.Fragment>

        <div className="d-flex m-1">
          <div className="font-weight-bold info-title">
            Use metamask:
        </div>
          <div style={{ width: '50px', textAlign: 'center' }}>
            <Input type="checkbox" checked={useMetaMask} onClick={() => setUseMetaMask(true)} />
          </div>
        </div>
        <div className="d-flex m-1">
          <div className="font-weight-bold info-title">
            Select blockchain
          </div>
          <div style={{ minWidth: '350px' }}>
            <Select
              placeholder="Select a blockchain to deploy"
              options={optionNetwork}
              value={selectedNetwork}
              onChange={e => setSelectedNetwork(e)}
            />
          </div>
        </div>
      </React.Fragment>
    }
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
    </NavItem>]
    if (sourceEdited) {
      listNav.push(<NavItem
        className="step-wrapper"
        key={1}
      // onClick={() => handleEnableAllSteps(1)}
      >
        <NavLink
          className={classnames(`step step-1`, {
            active: activeStep === 1 ? true : false,
            done: 1 < activeStep
          })}>
          <span className="step-text"> <Box size={20} /> </span>
        </NavLink>
      </NavItem>)
    }
    listNav.push(<NavItem
      className="step-wrapper"
      key={2}
    // onClick={() => handleEnableAllSteps(2)}
    >
      <NavLink
        className={classnames(`step step-2`, {
          active: activeStep === 2 ? true : false,
          done: 2 < activeStep
        })}>
        <span className="step-text"> <Info size={20} /> </span>
      </NavLink>
    </NavItem>)

    listNav.push(<NavItem
      className="step-wrapper"
      key={3}
    // onClick={() => handleEnableAllSteps(3)}
    >
      <NavLink
        className={classnames(`step step-1`, {
          active: activeStep === 3 ? true : false,
          done: 3 < activeStep
        })}>
        <span className="step-text"> <Layers size={20} /> </span>
      </NavLink>
    </NavItem>)

    return listNav
  }



  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <TabPane
          className={`step-content step-0-content`}
          key={0}
          tabId={0}>

          <div className="full-height d-flex justify-content-center align-items-center">
            <a className="d-block cursor-pointer text-center" href="/ide" target="_blank">
              <i style={{ fontSize: "80px" }} className="far fa-file-code"></i>

              <h2> Click here to custom  </h2>
              <h2> our Token source code </h2>
            </a>
          </div>
        </TabPane>
      case 1:
        return <TabPane
          className={`step-content step-1-content`}
          key={1}
          tabId={1}>
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              wheelPropagation: false
            }}
          >
            <Row className="mb-2" style={{ height: '100px' }}>
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
          </PerfectScrollbar>
        </TabPane>

      case 2:
        return <TabPane
          className={`step-content step-2-content`}
          key={2}
          tabId={2}>
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              wheelPropagation: false
            }}
          >
            <Row className="mb-1">
              <Col md={3} sm={0}></Col>
              <Col md={6} sm={12}>
                <h4 className="mb-1">Enter some information for new token</h4>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className="">
                  <h6 className="">Token symbol</h6>
                  <Input
                    type="text"
                    placeholder="Token's symbol"
                    value={tokenSymbol}
                    onChange={e => setTokenSymbol(e.target.value)}
                  />

                </div>
                <div className="mt-2">
                  <h6 className="">Token name</h6>
                  <Input
                    type="text"
                    placeholder="Token's name"
                    value={tokenName}
                    onChange={e => setTokenName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h6 className="">Total supply</h6>
                  <Input
                    type="number"
                    placeholder="Initial supply"

                    value={initialSupply}
                    onChange={e => setInitialSupply(e.target.value)}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="">
                  <h6 className="">Description</h6>
                  <Input
                    type="text"
                    placeholder="Description"

                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </PerfectScrollbar>
        </TabPane>
      case 3:
        return <TabPane
          className={`step-content step-3-content`}
          key={3}
          tabId={3}> <Row className="mb-2">
            <Col md="6" sm="12">
              <h4 className="m-1">Confirm Information</h4>
              {renderDeployCheckBox()}
              <div className="d-flex m-1">
                <div className="font-weight-bold info-title">
                  Token symbol:
              </div>
                <div> {tokenSymbol}</div>
              </div>
              <div className="d-flex m-1">
                <div className="font-weight-bold info-title">
                  Token name:
              </div>
                <div> {tokenName}</div>
              </div>

              <div className="d-flex m-1">
                <div className="font-weight-bold info-title">
                  Total Supply:
              </div>
                <div> {initialSupply}</div>
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
      className={`compose-token shadow-none ${props.modalOpen == 'create' ? "open" : ""
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
        <div className="wizard-actions d-flex justify-content-between mt-1">
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
              ? 'Create token'
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
    listNetwork: state.network.listNetwork,
    // listAccount: state.account.listAccount,
    modalOpen: state.tokenDev.modalOpen,

  }
}

const mapDispatchToProps = {
  getConfig,
  validateSource,
  getListNetwork,
  getAccountBalance,
  createToken,
  getListToken,
  setModalOpen,
  testDeploy,
  checkTokenSymbolExists
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateToken)
