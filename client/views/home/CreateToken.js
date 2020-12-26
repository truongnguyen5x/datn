import React, { useState, useEffect } from "react"
import { Input, Label, Spinner, Tooltip, CardBody, Button, Row, Col, FormGroup, CustomInput, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { X, ArrowLeft, Database, Briefcase, Image, Folder, Box, Layers } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import Wizard from "../../components/@vuexy/wizard/WizardCustom"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "../../assets/scss/plugins/extensions/editor.scss"
import { getConfig, validateSource } from "../../redux/actions/token-dev"
import { createVcoin, testDeploy, getListVCoin } from '../../redux/actions/vcoin'

import { connect } from "react-redux"
import { readBatchFile, writeOneFile } from '../../utility/file'
import Select from 'react-select'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { getWeb3 } from '../../utility/web3'
import "react-toastify/dist/ReactToastify.css"
import "../../assets/scss/plugins/extensions/toastr.scss"




const CreateToken = props => {

  const [sourceCode, setSourceCode] = useState([])

  const [selectedContractInterface, setSelectedContractInterface] = useState()
  const [listContractInterface, setListContractInterface] = useState([])
  const [dataConstructorDeploy, setDataConstructorDeploy] = useState([])
  const [accs, setAccs] = useState([])
  const [netId, setNetId] = useState(0)
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [existToken, setExistToken] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [balance, setBalance] = useState("")
  const [web3, setWeb3] = useState()

  const [contractAdd, setContractAdd] = useState("")

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
       setNetId(netId)})
  }

  const getNetType = (netId) => {
    switch (netId) {
      case 1:
        // console.log('This is mainnet')
        return 'mainnet'

      case 2:
        // console.log('This is the deprecated Morden test network.')
        return 'morden'

      case 3:
        // console.log('This is the ropsten test network.')
        return 'ropsten'

      default:
        // console.log('This is an unknown network.')
        return 'unknown'
    }
  }

  const getAndWriteTemplateCode = () => {
    props.getConfig('LIB.SOL')
      .then(res => {
        if (res.code) {
          const { value } = res.data
          writeOneFile('/Lib.sol', value)
        }
      })

    props.getConfig('MAIN.SOL')
      .then(res => {
        if (res.code) {
          const { value } = res.data
          writeOneFile('/Token.sol', value)
        }
      })
  }



  const checkDoneStep0 = async () => {
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

  const checkDoneStep1 = async () => {
    if (!selectedContractInterface) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a smart contract to deploy !'
      })
      throw new Error()
    }
    const { abi, bytecode } = selectedContractInterface
    const res = await props.testDeploy({ abi, bytecode, constructor: dataConstructorDeploy })
    if (res.code) {
      return
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your smart contract invalid !'
      })
      throw new Error()
    }
  }

  const onCloseModal = () => {
    props.onClose()
  }

  const onCheckDoneStep2 = async () => {
    let smartContractAddress
    const myContract = new web3.eth.Contract(selectedContractInterface.abi)

    return myContract.deploy({
      data: selectedContractInterface.bytecode,
      arguments: dataConstructorDeploy
    }).send({
      from: accs[0],
      gas: 5000000
    })
      .on('error', (error) => {
        console.log('error')
      })
      .on('transactionHash', async (transactionHash) => {
        console.log('transactionHash', transactionHash)
      })
      .on('receipt', async (receipt) => {
        console.log('receipt', receipt)
        setContractAdd(receipt.contractAddress)
        smartContractAddress = receipt.contractAddress
      })
      .on('confirmation', async (confirmationNumber, receipt) => {
        console.log('confirm', confirmationNumber, receipt)
      })
      .then(async (newContractInstance) => {
        console.log('then', newContractInstance.options.address) // instance with the new contract address
        return props.createVcoin({
          account: accs[0],
          network_id: netId,
          abi: selectedContractInterface.abi,
          address: smartContractAddress
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

  const step0 = {
    title: <Folder size={20} />,
    content: <div className="full-height d-flex justify-content-center align-items-center">
      <a className="d-block cursor-pointer text-center" href="/ide" target="_blank">
        <i style={{ fontSize: "80px" }} className="far fa-file-code"></i>

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
        <Wizard
          finishBtnText="Create token"
          checkDoneStep={[checkDoneStep0, checkDoneStep1, onCheckDoneStep2]}
          steps={[step0, step1, step2]}
        />
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


export default connect(mapStateToProps, mapDispatchToProps)(CreateToken)
