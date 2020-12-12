import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button } from "reactstrap"
import { Plus } from 'react-feather'
import Sidebar from "react-sidebar"
import { getListVCoin, getVCoinById } from "../../redux/actions/vcoin/index"

import PerfectScrollbar from "react-perfect-scrollbar"

import { ContextLayout } from "../../utility/context/Layout"


const ListVCoin = (props) => {
    const [isModalCreate, openModalCreate] = useState(false)
    const [isModalDetail, openModalDetail] = useState(false)
    const [isModalUpdate, openModalUpdate] = useState(false)
    const [vcoin, setVCoin] = useState()
    const [sidebarOpen, setSidebarOpen] = useState(false)


    const handleComposeSidebar = status => {
        if (status === "open") {
            openModalCreate(true)
        } else {
            openModalCreate(false)
        }
    }


    useEffect(() => {
        props.getListVCoin(props.filter)
    }, [])

    const onCloseModalCreate = () => {
        openModalCreate(false)
    }
    const onCloseModalDetail = () => {
        openModalDetail(false)
    }

    const renderListVCoin = () => {
        const { listVCoin } = props

        if (!listVCoin.length) {
            return <div className="no-results show">
                <h5>No Items Found</h5>
            </div>
        }
        return listVCoin.map(i => <li key={i.id} onClick={() => { openModalDetail(true); props.getVCoinById(i.id) }}>
            <div className="left">
                <h5>ID: {i.id}</h5>
                <span>{i.smartContract.address}</span>
            </div>
            <div className="right">
                <span>Network: {i.smartContract.network.name}</span>
            </div>
        </li>)
    }

    return <React.Fragment>
       <h2>List vcoin</h2>

    </React.Fragment>
}

const mapDispatchToProps = {
    getListVCoin,
    getVCoinById
}

const mapStateToProps = state => {
    return {
        listVCoin: state.vcoin.listVCoin,
        filter: state.vcoin.filter
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListVCoin)