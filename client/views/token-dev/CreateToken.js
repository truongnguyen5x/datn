import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { ArrowLeft, Box, Folder, Layers } from "react-feather"
import { connect } from "react-redux"
import Select from 'react-select'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { Col, Input, Row } from "reactstrap"
import Swal from 'sweetalert2'
import "../../assets/scss/plugins/extensions/editor.scss"
import "../../assets/scss/plugins/extensions/toastr.scss"
import Wizard from "../../components/@vuexy/wizard/WizardCustom"
import { getAccountBalance } from '../../redux/actions/account'
import { getListNetwork } from "../../redux/actions/network"
import { createToken, getConfig, getListToken, setModalOpen, testDeploy, validateSource } from "../../redux/actions/token-dev"
import { readBatchFile, writeOneFile, clearAll } from '../../utility/file'
import { getWeb3, getNetType } from '../../utility/web3'




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
    props.getListNetwork()
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
      console.log(netId)
      setNetId(netId)
    })
  }


  const getAndWriteTemplateCode = () => {
    clearAll()
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
      const { data } = res
      setTokenSymbol(data.symbol)
      setExchangeRate(data.exchangedRatePercent)
      setExistToken(data.existToken)
      setTotalSupply(data.totalSupply)
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
    props.setModalOpen("")
  }

  const onCheckDoneStep2 = async () => {
    console.log(web3.eth.defaultChain)
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
        return props.createToken({
          account: accs[0],
          network_id: netId,
          abi: selectedContractInterface.abi,
          address: smartContractAddress,
          source: sourceCode,
          symbol: tokenSymbol,
          token_id: existToken ? existToken.id : 0,
          exchangeRate
        })
      })
      .then(res => {
        if (res.code) {
          resetState()
          props.setModalOpen("")
          props.getListToken()
          toast.success("Create token success")
        } else {
          toast.error("Create token error !")
        }
      })
  }


  // const CustomOption = ({ innerProps, innerRef, data, ...rest }) => {
  //   // console.log(rest)
  //   return <div className="list-option-select" ref={innerRef} {...innerProps}>
  //     <div>{data.name}</div>
  //     <div>{data.path}</div>
  //   </div>
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

  const step0 = {
    title: <Folder size={20} />,
    content: <div className="full-height d-flex justify-content-center align-items-center">
      <a className="d-block cursor-pointer text-center" href="/ide" target="_blank">
        <i style={{ fontSize: "80px" }} className="far fa-file-code"></i>

        <h2> Click here to custom  </h2>
        <h2> our Token source code </h2>
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
        <div className="d-flex m-1">
          <div className="font-weight-bold info-title">
            Token symbol:
            </div>
          <div> {tokenSymbol}</div>
        </div>
        <div className="d-flex m-1">
          <div className="font-weight-bold info-title">
            Exchange Rate:
            </div>
          <div> {exchangeRate} %</div>
        </div>
        <div className="d-flex m-1">
          <div className="font-weight-bold info-title">
            Total Supply:
            </div>
          <div> {totalSupply}</div>
        </div>
      </Col>
      <Col md="6" sm="12">
      </Col>
    </Row>
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
  setModalOpen,
  testDeploy
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateToken)
