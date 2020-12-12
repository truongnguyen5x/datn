import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button } from "reactstrap"
import { Plus } from 'react-feather'
import Sidebar from "react-sidebar"
import { getListToken } from "../../redux/actions/token-admin"

import PerfectScrollbar from "react-perfect-scrollbar"

import { ContextLayout } from "../../utility/context/Layout"



const ListToken = (props) => {
    const [isModalCreate, openModalCreate] = useState(false)
    const [isModalDetail, openModalDetail] = useState(false)
    const [isModalUpdate, openModalUpdate] = useState(false)

    const [sidebarOpen, setSidebarOpen] = useState(false)


    const handleComposeSidebar = status => {
        if (status === "open") {
            openModalCreate(true)
        } else {
            openModalCreate(false)
        }
    }


    useEffect(() => {
        props.getListToken(props.filter)
    }, [])

    const onCloseModalCreate = () => {
        openModalCreate(false)
    }
    const onCloseModalDetail = () => {
        openModalDetail(false)
    }

    const renderListToken = () => {
        const { listToken } = props

        if (!listToken.length) {
            return <div className="no-results show">
                <h5>No Items Found</h5>
            </div>
        }
        return listToken.map(i => <li key={i.id} onClick={() => { alert("not implement") }}>
            <h5>ID: {i.id}</h5>
            <div><span>{i.symbol}</span></div>
        </li>)
    }

    return <React.Fragment>
        <h2>Token admin</h2>
        

    </React.Fragment>
}

const mapDispatchToProps = {
    getListToken
}

const mapStateToProps = state => {
    return {
        listToken: state.token.listToken,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListToken)