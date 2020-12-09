import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button } from "reactstrap"
import { Plus } from 'react-feather'
import { getListVCoin } from "../../redux/actions/vcoin/index"
import CreateVCoin from "./CreateVCoin"
import DetailVCoin from "./DetailVCoin"
import PerfectScrollbar from "react-perfect-scrollbar"
import VCoinSidebar from "./VCoinSidebar"
import { ContextLayout } from "../../utility/context/Layout"
import "../../assets/scss/pages/vcoin.scss"

const ListVCoin = (props) => {
    const [isModalCreate, openModalCreate] = useState(false)
    const [isModalDetail, openModalDetail] = useState(false)
    const [isModalUpdate, openModalUpdate] = useState(false)
    const [vcoin, setVCoin] = useState()

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
        return listVCoin.map(i => <li key={i.id} onClick={() => { openModalDetail(true); setVCoin(i) }}>
            <h5>{i.name}</h5>
            <span>{i.address}</span>
        </li>)
    }

    return <React.Fragment>
        <div className="vcoin-list position-relative">
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
                className="vcoin-list-scroll list-group"
                options={{
                    wheelPropagation: false
                }}
            >
                <ul className="vcoin-list-wrapper media-list">{renderListVCoin()}</ul>
            </PerfectScrollbar>
            <CreateVCoin
                visible={isModalCreate}
                onClose={onCloseModalCreate}
            />
            <DetailVCoin
                visible={isModalDetail}
                onClose={onCloseModalDetail}
                data={vcoin}
            />
        </div>

    </React.Fragment>
}

const mapDispatchToProps = {
    getListVCoin
}

const mapStateToProps = state => {
    return {
        listVCoin: state.vcoin.listVCoin,
        filter: state.vcoin.filter
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListVCoin)