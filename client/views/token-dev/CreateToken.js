import classnames from "classnames"
import { useFormik } from 'formik'
import _ from 'lodash'
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { ArrowLeft, Box, Folder, Info, Layers } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import Select from 'react-select'
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Button, Col, Input, Nav,
  NavItem,
  NavLink, Row,

  TabContent,
  TabPane
} from "reactstrap"
import Swal from 'sweetalert2'
import "../../assets/scss/plugins/extensions/editor.scss"
import "../../assets/scss/plugins/extensions/toastr.scss"
import { getAccountBalance } from '../../redux/actions/account'
import { setLoading } from '../../redux/actions/home'
import { getListNetwork } from '../../redux/actions/network'
import { checkTokenSymbolExists, createToken, getConfig, getListToken, setModalOpen, testDeploy, validateSource } from "../../redux/actions/token-dev"
import { sleep } from '../../utility'
import { clearAll, readBatchFile, writeOneFile } from '../../utility/file'
import { deployWithEstimateGas, getNetType, getWeb3, sendWithEstimateGas } from '../../utility/web3'

const CreateToken = props => {

  const [sourceCode, setSourceCode] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [listContractInterface, setListContractInterface] = useState([])
  const [accs, setAccs] = useState([])
  const [netId, setNetId] = useState(0)
  const [balance, setBalance] = useState("")
  const [web3, setWeb3] = useState()
  const [sourceEdited, setSourceEdited] = useState(false)
  const [libSol, setLibSol] = useState('')
  const [tokenSol, setTokenSol] = useState('')
  const [useMetaMask, setUseMetaMask] = useState(false)

  const validate1 = values => {
    const errors = {}
    if (!values.interface) {
      errors.interface = 'Required !'
    }
    errors.dataConstructor = formik1.values.dataConstructor.map(i => !i)
    console.log('validate1', errors, formik1.values.dataConstructor)
    return errors
  }
  const formik1 = useFormik({
    initialValues: {
      interface: null,
      dataConstructor: []
    },
    validateOnChange: false,
    validate: validate1
  })

  const validate2 = values => {
    const errors = {}
    if (!values.symbol) {
      errors.symbol = 'Required !'
    }
    if (!values.name) {
      errors.name = 'Required !'
    }
    if (!values.supply) {
      errors.supply = 'Required !'
    }
    // console.log('validate', errors)
    return errors
  }

  const formik2 = useFormik({
    initialValues: {
      symbol: '',
      name: '',
      description: '',
      supply: ''
    },
    validate: validate2
  });


  const validate3 = values => {
    const errors = {}
    if (!values.network) {
      errors.network = 'Required !'
    }
    return errors
  }

  const formik3 = useFormik({
    initialValues: {
      network: null
    },
    validate: validate3
  })


  useEffect(() => {
    getAndWriteTemplateCode()
    props.getListNetwork()
    // .then(res => console.log(res))
    getWeb3()
      .then(res => {
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccs(accounts.map(i => i.toUpperCase()))
          });
          window.ethereum.on('chainChanged', (chainId) => {
            setNetId(chainId)
          });
        }
        if (res) {
          setWeb3(res)
          getInfo(res)
        }
      })
      .catch(err => console.log(err))
  }, [])

  const resetState = () => {
    formik1.resetForm()
    formik2.resetForm()
    formik3.resetForm()
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

  const getInfo = async (web3) => {
    web3.eth.getAccounts().then(listAcc => {
      setAccs(listAcc.map(i => i.toUpperCase()))
      // setAccs(listAcc)
      web3.eth.getBalance(listAcc[0])
        .then(e => {
          setBalance(web3.utils.fromWei(e))
        })
    })
    web3.eth.net.getId().then(netId => {
      setNetId(netId)
    })
  }


  const getAndWriteTemplateCode = async () => {
    while (!window.remixFileSystem) {
      await sleep(500)
    }
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
    if (e?.inputs) {
      console.log("🚀 ~ file: CreateToken.js ~ line 132 ~ onChangeContractInterface ~ e", e)
      formik1.setFieldError('dataConstructor', Array(e.inputs.length).fill(""))
      formik1.setFieldValue('dataConstructor', Array(e.inputs.length).fill(""))
    }
    formik1.setFieldValue('interface', e)
  }


  const onChangeDataConstructorDeploy = (idx, e) => {
    // console.log("🚀 ~ file: CreateToken.js ~ line 136 ~ onChangeDataConstructorDeploy ~ idx, e", idx, e)
    const { dataConstructor } = formik1.values
    dataConstructor[idx] = e.target.value
    formik1.setFieldValue('dataConstructor', dataConstructor)
  }

  const checkDoneStep0 = async () => {
    props.setLoading(true)
    const source1 = readBatchFile();
    setSourceCode(source1)
    const res = await props.validateSource(source1)
    if (res.code && res.data.length) {
      setListContractInterface(res.data.map((i, idx) => {
        i.label = i.file + '/' + i.contract
        i.value = idx
        return i
      }))
      console.log(source1)
      if (source1[0].path == '/Lib.sol' && source1[0].code == libSol
        && source1[1].path == '/Token.sol' && source1[1].code == tokenSol) {
        setSourceEdited(false)
        const temp = res.data.find(i => i.file == '/Token.sol')
        formik1.setValues({ interface: temp, dataConstructor: ['1000000'] })
        const { abi, bytecode } = temp
        const res1 = await props.testDeploy({ abi, bytecode, constructor: ['1000000'] })
        if (res1.code && res1.data.existToken) {
          const { name, description, initial_supply } = res1.data.existToken
          console.log("🚀 ~ file: CreateToken.js ~ line 166 ~ checkDoneStep0 ~ res.data.existToken", res.data.existToken)
          formik2.setValues({ symbol: 'TK1', name, description, supply: initial_supply })
        } else {
          formik2.setValues({ symbol: 'TK1', name: 'token1', supply: '1000000000000000000000000' })
        }
        setActiveStep(2)
      } else {
        formik1.resetForm()
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
      props.setLoading(false)
    }
    props.setLoading(false)
  }

  const checkDoneStep1 = async () => {
    const errors = await formik1.validateForm()
    if (errors.interface || errors.dataConstructor.some(i => i)) {
      return
    }
    props.setLoading(true)
    // TODO
    const { abi, bytecode } = formik1.values.interface
    const res = await props.testDeploy({ abi, bytecode, constructor: formik1.values.dataConstructor })
    if (res.code) {
      const { data } = res
      if (data.existToken) {
        const { name, description, initial_supply } = data.existToken
        formik2.setValues({ symbol: data.symbol, name, description, supply: initial_supply })
      } else {
        formik2.setValues({ symbol: data.symbol, supply: data.totalSupply, name: data.name })
      }
      setActiveStep(2)
      props.setLoading(false)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your smart contract invalid !'
      })
      props.setLoading(false)
    }
  }

  const checkDoneStep2 = async () => {
    const errors = await formik2.validateForm()
    if (!_.isEmpty(errors)) {
      return
    }
    props.setLoading(true)
    const res = await props.checkTokenSymbolExists(formik2.values.symbol)
    console.log("🚀 ~ file: CreateToken.js ~ line 222 ~ checkDoneStep2 ~ res", res)
    if (res.code) {
      setActiveStep(3)
      props.setLoading(false)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Token symbol already taken !'
      })
      props.setLoading(false)
    }
  }

  const checkDoneStep3 = async () => {
    if (!useMetaMask || !web3 || !sourceEdited) {
      const errors = await formik3.validateForm()
      if (!_.isEmpty(errors)) {
        return
      }
    }
    props.setLoading(true)
    const { abi, bytecode } = formik1.values.interface
    const { name, symbol, supply, description } = formik2.values
    if (useMetaMask) {
      let smartContractAddress
      const myContract = new web3.eth.Contract(abi)
      const deploy = myContract.deploy({
        data: bytecode,
        arguments: formik1.values.dataConstructor
      })
      deployWithEstimateGas(deploy, accs[0])
        .then(instance => {
          smartContractAddress = instance.options.address
          const setInfo = instance.methods.setInfo(symbol, name, supply)
          return sendWithEstimateGas(setInfo, accs[0])
        })
        .then(() => {
          return props.createToken({
            source: sourceCode,
            chain_id: getNetType(netId),
            tokenSymbol: symbol,
            abi,
            initialSupply: supply,
            tokenName: name,
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
            props.setLoading(false)
          } else {
            toast.error('Create token error')
            props.setLoading(false)
          }
        })
        .catch(error => {
          props.setLoading(false)
          console.log(error)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something error'
          })
        })
    } else {
      // console.log("🚀 ~ file: CreateToken.js ~ line 259 ~ checkDoneStep3 ~ selectedNetwork", selectedNetwork)
      props.createToken({
        source: sourceCode,
        network_id: formik3.values.network.id,
        constructorData: formik1.values.dataConstructor,
        bytecode: bytecode,
        tokenSymbol: symbol,
        abi,
        initialSupply: supply,
        tokenName: name,
        description
      })
        .then(res => {
          if (res.code) {
            resetState()
            props.setModalOpen("")
            props.getListToken()
            toast.success('Create token success')
            props.setLoading(false)
          } else {
            toast.error('Create token error')
            props.setLoading(false)
          }
        })
    }
  }

  const onCloseModal = () => {
    props.setModalOpen("")
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
    if (activeStep == 2 && sourceEdited == false) {
      setActiveStep(0)
    } else {
      setActiveStep(activeStep - 1)
    }
  }

  const renderConstructorDeploy = () => {
    return <div className="mt-2">
      <h5>Enter params to deploy {formik1.values.interface.label}</h5>
      {formik1.values.interface.inputs.map((i, idx) => {
        let type = "text"
        switch (i.type) {
          case "uint256":
            type = "number"
        }
        return <React.Fragment key={idx}>
          <Input
            className="mt-1"
            invalid={formik1.errors?.dataConstructor?.[idx] ? true : false}
            type={type}
            placeholder={i.name}
            value={formik1.values.dataConstructor[idx]}
            onChange={e => onChangeDataConstructorDeploy(idx, e)}
          />
          {formik1.errors?.dataConstructor?.[idx] && <div className="error-text">Required !</div>}
        </React.Fragment>
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
          value={formik3.values.network}
          onChange={e => formik3.setFieldValue('network', e)}
        />
        {formik3.errors.network && <div className="error-text">Required !</div>}
      </div>
    </div>
    if (useMetaMask) {
      return <React.Fragment>
        <div className="d-flex m-1">
          <div className="font-weight-bold info-title">
            Use metamask:
        </div>
          <div style={{ width: '38px' }} className="text-center">
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
          <div style={{ width: '38px' }} className="text-center">
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
              value={formik3.values.network}
              onChange={e => formik3.setFieldValue('network', e)}
            />

            {formik3.errors.network && <div className="error-text">Required !</div>}
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
          tabId={1}>
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              wheelPropagation: false
            }}
          >
            <Row className="mb-2 child-scroll">
              <Col md={3} sm={0}></Col>
              <Col md={6} sm={12}>
                <h5>Select a smart contract</h5>
                <Select
                  name="interface"
                  placeholder="Select a smart contract to deploy"
                  options={listContractInterface}
                  value={formik1.values.interface}
                  onChange={onChangeContractInterface}
                />
                {formik1.errors.interface ? <div className="error-text">{formik1.errors.interface}</div> : null}
                {formik1.values.interface && formik1.values.interface.inputs && renderConstructorDeploy()}
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
            <div className=" child-scroll">
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
                      invalid={formik2.errors.symbol && formik2.touched.symbol}
                      name="symbol"
                      type="text"
                      placeholder="Token's symbol"
                      value={formik2.values.symbol}
                      onBlur={formik2.handleBlur}
                      onChange={formik2.handleChange}
                    />
                    {formik2.errors.symbol && formik2.touched.symbol ? <div className="error-text">{formik2.errors.symbol}</div> : null}
                  </div>
                  <div className="mt-2">
                    <h6 className="">Token name</h6>
                    <Input
                      invalid={formik2.errors.name && formik2.touched.name}
                      name="name"
                      type="text"
                      value={formik2.values.name}
                      onBlur={formik2.handleBlur}
                      onChange={formik2.handleChange}
                    />
                    {formik2.errors.name && formik2.touched.name ? <div className="error-text">{formik2.errors.name}</div> : null}
                  </div>
                  <div className="mt-2">
                    <h6 className="">Total supply</h6>
                    <Input
                      invalid={formik2.errors.supply && formik2.touched.supply}
                      name="supply"
                      type="number"
                      placeholder="Initial supply"
                      value={formik2.values.supply}
                      onBlur={formik2.handleBlur}
                      onChange={formik2.handleChange}
                    />
                    {formik2.errors.supply && formik2.touched.supply ? <div className="error-text">{formik2.errors.supply}</div> : null}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="">
                    <h6 className="">Description</h6>
                    <Input
                      type="text"
                      placeholder="Description"
                      name="description"
                      value={formik2.values.description}
                      onChange={formik2.handleChange}
                    />
                  </div>
                </Col>
              </Row>

            </div>
          </PerfectScrollbar>
        </TabPane>
      case 3:
        return <TabPane
          className={`step-content step-3-content`}
          key={3}
          tabId={3}>
          <PerfectScrollbar
            options={{
              suppressScrollX: true,
              wheelPropagation: false
            }}
          >
            <Row className="mb-2 child-scroll">
              <Col md="6" sm="12">
                <h4 className="m-1">Confirm Information</h4>
                {renderDeployCheckBox()}
                <div className="d-flex m-1">
                  <div className="font-weight-bold info-title">
                    Token symbol:
              </div>
                  <div> {formik2.values.symbol}</div>
                </div>
                <div className="d-flex m-1">
                  <div className="font-weight-bold info-title">
                    Token name:
              </div>
                  <div> {formik2.values.name}</div>
                </div>

                <div className="d-flex m-1">
                  <div className="font-weight-bold info-title">
                    Total Supply:
              </div>
                  <div> {formik2.values.supply}</div>
                </div>
              </Col>
              <Col md="6" sm="12">
              </Col>
            </Row>
          </PerfectScrollbar>
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
            onClick={() => { onCloseModal(); resetState() }}
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
            color='danger'
            disabled={activeStep === 0}
            onClick={handlePreviousStep}>
            Prev
        </Button>
          <Button
            type="button"
            color='danger'
            className='d-flex align-items-center'
            onClick={handleNextStep}
          >
            {3 === activeStep
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
  checkTokenSymbolExists,
  setLoading
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateToken)
