import React, { useState, useEffect } from "react"
import { Input, Label, Spinner, Tooltip, CardBody, Button, Row, Col, FormGroup, CustomInput, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { X, ArrowLeft, Home, Briefcase, Image, Folder, Box, Layers } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import Wizard from "../../components/@vuexy/wizard/WizardCustom"
import classnames from "classnames"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "../../assets/scss/plugins/extensions/editor.scss"
import { getFileById, getListTokenAdmin, validateSource, createToken } from "../../redux/actions/token"
import { getAccountBalance } from '../../redux/actions/account'
import { getListNetwork } from "../../redux/actions/network"
import { connect } from "react-redux"
import Editor from './Editor'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import "../../assets/scss/plugins/extensions/toastr.scss"

const CreateToken = props => {

  const [sourceCode, setSourceCode] = useState([])
  const [selectedContractInterface, setSelectedContractInterface] = useState()
  const [contractInterface, setContractInterface] = useState([])
  const [dataConstructorDeploy, setDataConstructorDeploy] = useState([])
  const [selectedNetwork, setSelectedNetwork] = useState()
  const [selectedAccount, setSelectedAccount] = useState()
  const [loadingAccount, setLoadingAccount] = useState(false)


  useEffect(() => {
    props.getFileById(1)
      .then(res => {
        if (res.code) {
          const { code, path } = res.data
          sourceCode.push({ code, path })
          setSourceCode([...sourceCode])
        }
      })
    props.getFileById(3)
      .then(res => {
        if (res.code) {
          const { code, path } = res.data
          sourceCode.push({ code, path })
          setSourceCode([...sourceCode])
        }
      })

    props.getListNetwork()
    return () => {

    }
  }, [])

  const networkOption = props.listNetwork.map(i => {
    i.value = i.id
    i.label = i.name
    return i
  })

  const handleChangeSourceCode = (newSource) => {
    setSourceCode(newSource)
  }

  const checkDoneSourceCode = async () => {
    const res = await props.validateSource(sourceCode)
    if (res.code) {
      setContractInterface(res.data.map((i, idx) => {
        i.label = i.file + '/' + i.contract
        i.value = idx
        return i
      }))
      console.log('done')
      return
    } else {
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
    return
  }


  const onChangeNetwork = async (e) => {
    console.log(e)
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

  const handleComposeSidebar = () => {
    props.handleComposeSidebar("close")
    
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
      console.log('create token done ', res.data)
      props.handleComposeSidebar("close")
 
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

  const steps = [
    {
      title: <Folder size={20} />,
      content: <Editor
        source={sourceCode}
        onChangeCode={handleChangeSourceCode}
      />
    },
    {
      title: <Box size={20} />,
      content: <Row className="mb-2">
        <Col md={6}>
          <Label>Select a smart contract</Label>
          <Select
            placeholder="Select a smart contract to deploy"
            options={contractInterface}
            value={selectedContractInterface}
            onChange={onChangeContractInterface}
          />
          {selectedContractInterface && selectedContractInterface.inputs && renderConstructorDeploy()}
        </Col>
      </Row>
    },
    {
      title: <Layers size={20} />,
      content: <Row className="mb-2">
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
  ]

  return (
    <div
      className={`compose-email shadow-none ${props.currentStatus ? "open" : ""
        }`}
    >
      <div className="compose-mail-header align-items-center">
        <div className="compose-mail-title d-flex align-items-center mb-1">
          <ArrowLeft
            size={20}
            className="mr-1 cursor-pointer"
            onClick={handleComposeSidebar}
          />
          <h4 className="mb-0">New token</h4>
        </div>
      </div>
      <div className="ml-1 mr-1 compose-mail-body">

        <Wizard
          checkDoneStep={[checkDoneSourceCode, checkDoneConstructorDeploy, onCheckLastStep]}
          steps={steps}
        />
      </div>
      <ToastContainer />
    </div>
  )

}
const mapStateToProps = state => {
  return {
    listNetwork: state.network.listNetwork,
    listAccount: state.account.listAccount
  }
}

const mapDispatchToProps = {
  getFileById,
  validateSource,
  getListNetwork,
  getAccountBalance,
  createToken,
  getListTokenAdmin
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateToken)
