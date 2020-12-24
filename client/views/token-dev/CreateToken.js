import React, { useState, useEffect } from "react"
import { Input, Label, Spinner, Tooltip, CardBody, Button, Row, Col, FormGroup, CustomInput, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { X, ArrowLeft, Database, Briefcase, Image, Folder, Box, Layers } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import Wizard from "../../components/@vuexy/wizard/WizardCustom"
import { useFormik } from 'formik';
import classnames from "classnames"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "../../assets/scss/plugins/extensions/editor.scss"
import { getListToken, createToken, validateSource, getConfig, setModalOpen } from "../../redux/actions/token-dev"
import { getAccountBalance } from '../../redux/actions/account'
import { getListNetwork } from "../../redux/actions/network"
import { connect } from "react-redux"
import { writeBatchFile, readBatchFile, writeOneFile } from '../../utility/file'
// import { compileSourceCode } from '../../utility/solc'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { getWeb3 } from '../../utility/web3'
import "react-toastify/dist/ReactToastify.css"
import "../../assets/scss/plugins/extensions/toastr.scss"
// import { await } from "signale"


const CreateToken = props => {

  const [sourceCode, setSourceCode] = useState([])

  const [selectedContractInterface, setSelectedContractInterface] = useState()
  const [listContractInterface, setListContractInterface] = useState([])
  const [dataConstructorDeploy, setDataConstructorDeploy] = useState([])
  const [selectedNetwork, setSelectedNetwork] = useState()
  const [selectedAccount, setSelectedAccount] = useState()
  const [loadingAccount, setLoadingAccount] = useState(false)
  const [web3, setWeb3] = useState()

  useEffect(() => {
    getAndWriteTemplateCode()
    props.getListNetwork()
    getWeb3()
    .then(res =>{
      setWeb3(res)
      getInfo(res)
    })
    .catch(err => console.log(err))
  }, [])

  const getInfo = async (web3) => {
   const listAcc = await web3.eth.getAccounts()
    console.log(listAcc)
    console.log(web3.eth.accounts.wallet)
  }

  const getAndWriteTemplateCode = () => {
    props.getConfig('LIB.SOL')
      .then(res => {
        if (res.code) {
          const { value } = res.data
          writeOneFile('/Lib.sol', value)
        }
      })

    props.getConfig('TOKEN.SOL')
      .then(res => {
        if (res.code) {
          const { value } = res.data
          writeOneFile('/Token.sol', value)
        }
      })
  }

  const networkOption = props.listNetwork.map(i => {
    i.value = i.id
    i.label = i.name
    return i
  })

  const checkDoneSourceCode = async () => {
    const source1 = readBatchFile();
    setSourceCode(source1)
    const res = await props.validateSource(source1)
    if (res.code) {
      setListContractInterface(res.data.map((i, idx) => {
        i.label = i.file + '/' + i.contract
        i.value = idx
        return i
      }))
      return
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Validate source code error, review your code again !'
      })
      throw new Error("error")
    }
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

  const checkDoneConstructorDeploy = async () => {
    if (!selectedContractInterface) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a smart contract to deploy !'
      })
      throw new Error()
    }
    return
  }

  const onChangeNetwork = async (e) => {
    setSelectedNetwork(e)
    setLoadingAccount(true)
    await props.getAccountBalance({ network_id: e.id })
    setLoadingAccount(false)
  }

  const accountOption = props.listAccount.map(i => {
    i.label = i.name
    return i
  })

  const onChangeAccount = async (e) => {
    setSelectedAccount(e)
  }

  const onCloseModal = () => {
    props.setModalOpen("")
  }


  const onCheckLastStep = async () => {
    const res = await props.createToken({
      account: selectedAccount.id,
      network: selectedNetwork.id,
      contract: selectedContractInterface,
      constructor: dataConstructorDeploy,
      source: sourceCode
    })
    if (res.code) {
      props.setModalOpen("")
      toast.success("Create token success")
    } else {
      toast.error("Create token error !")
    }
    return
  }

  const CustomOptionAccount = ({ innerProps, innerRef, data, ...rest }) => {
    // console.log(rest)
    return <div className="list-option-select" ref={innerRef} {...innerProps}>
      <div>
        <div>{data.name}</div>
        <div>{data.address}</div>
      </div>
      <div>{data.balance}</div>
    </div>
  }

  const CustomOption = ({ innerProps, innerRef, data, ...rest }) => {
    // console.log(rest)
    return <div className="list-option-select" ref={innerRef} {...innerProps}>
      <div>{data.name}</div>
      <div>{data.path}</div>
    </div>
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

  const step0 = {
    title: <Folder size={20} />,
    content: <div className="full-height d-flex justify-content-center align-items-center">
      <a className="d-block cursor-pointer text-center" href="/ide" target="_blank">
        <i style={{ fontSize: "80px" }} class="far fa-file-code"></i>

        <h2> Custom your Token  </h2>
        <h2> source code </h2>
      </a>
    </div>
  }
  const step1 = {
    title: <Box size={20} />,
    content: <Row className="mb-2">
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
  }
  const step2 = {
    title: <Layers size={20} />,
    content: <Row className="mb-2">
      <Col md="3" sm="0"></Col>
      <Col md="6" sm="12">
        <FormGroup>
          <Label>Select a network</Label>
          <Select
            placeholder="Select a network to deploy"
            value={selectedNetwork}
            onChange={onChangeNetwork}
            options={networkOption}
            components={{ Option: CustomOption }}
          />
        </FormGroup>
        {selectedNetwork &&
          <FormGroup
            className="mt-1">
            <Label>Select a account</Label>
            <Select
              isLoading={loadingAccount}
              value={selectedAccount}
              onChange={onChangeAccount}
              placeholder="Select a account to deploy"
              options={accountOption}
              components={{ Option: CustomOptionAccount }}
            />
          </FormGroup>
        }
      </Col>
    </Row>
  }


  return (
    <div
      className={`compose-email shadow-none ${props.modalOpen == 'create' ? "open" : ""
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
        <Wizard
          checkDoneStep={[checkDoneSourceCode, checkDoneConstructorDeploy, onCheckLastStep]}
          steps={[step0, step1, step2]}
        />
      </div>
    </div>
  )

}
const mapStateToProps = state => {
  return {
    listNetwork: state.network.listNetwork,
    listAccount: state.account.listAccount,
    modalOpen: state.tokenDev.modalOpen
  }
}

const mapDispatchToProps = {
  getConfig,
  validateSource,
  getListNetwork,
  getAccountBalance,
  createToken,
  getListToken,
  setModalOpen
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateToken)
