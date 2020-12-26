import React, { useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { Button } from "reactstrap"
import "../../assets/scss/pages/account.scss"
import { getListAccount } from "../../redux/actions/account/index"
import { getProfile } from '../../redux/actions/auth/loginActions'
import CreateAccount from "./CreateAccount"
import DetailAccount from "./DetailAccount"

const ListAccount = (props) => {
    const [isModalCreate, openModalCreate] = useState(false)
    const [isModalDetail, openModalDetail] = useState(false)
    const [isModalUpdate, openModalUpdate] = useState(false)
    const [account, setAccount] = useState()

    useEffect(() => {
        props.getListAccount()
        props.getProfile()
    }, [])

    const onCloseModalCreate = () => {
        openModalCreate(false)
    }
    const onCloseModalDetail = () => {
        openModalDetail(false)
    }

    const renderListAccount = () => {
        const { listAccount } = props

        if (!listAccount.length) {
            return <div className="no-results show">
                <h5>No Items Found</h5>
            </div>
        }
        return listAccount.map(i => <li key={i.id} onClick={() => { openModalDetail(true); setAccount(i) }}>
            <h5>{i.name}</h5>
            <span>{i.address}</span>
        </li>)
    }

    return <React.Fragment>
        <div className="account-list position-relative">
            <div>
                <Button.Ripple
                    id="btn-add"
                    color="primary"
                    className="d-sm-block d-none "
                    onClick={() => openModalCreate(true)}
                >
                    {" "}
                    <Plus size={15} /> <span className="align-middle">Add</span>
                </Button.Ripple>
            </div>
            <PerfectScrollbar
                className="account-list-scroll list-group"
                options={{
                    wheelPropagation: false
                }}
            >
                <ul className="account-list-wrapper media-list">{renderListAccount()}</ul>
            </PerfectScrollbar>
            <CreateAccount
                visible={isModalCreate}
                onClose={onCloseModalCreate}
            />
            <DetailAccount
                visible={isModalDetail}
                onClose={onCloseModalDetail}
                data={account}
            />
        </div>

    </React.Fragment>
}

const mapDispatchToProps = {
    getListAccount,
    getProfile
}

const mapStateToProps = state => {
    return {
        listAccount: state.account.listAccount
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListAccount)