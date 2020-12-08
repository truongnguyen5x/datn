import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button } from "reactstrap"
import { Plus } from 'react-feather'
import { getListVChain } from "../../redux/actions/vchain/index"
import CreateVChain from "./CreateVChain"
import DetailVChain from "./DetailVChain"
import PerfectScrollbar from "react-perfect-scrollbar"
import "../../assets/scss/pages/vchain.scss"

const ListVChain = (props) => {
    const [isModalCreate, openModalCreate] = useState(false)
    const [isModalDetail, openModalDetail] = useState(false)
    const [isModalUpdate, openModalUpdate] = useState(false)
    const [vchain, setVChain] = useState()

    useEffect(() => {
        props.getListVChain()
    }, [])

    const onCloseModalCreate = () => {
        openModalCreate(false)
    }
    const onCloseModalDetail = () => {
        openModalDetail(false)
    }

    const renderListVChain = () => {
        const { listVChain } = props

        if (!listVChain.length) {
            return <div className="no-results show">
                <h5>No Items Found</h5>
            </div>
        }
        return listVChain.map(i => <li key={i.id} onClick={() => { openModalDetail(true); setVChain(i) }}>
            <h5>{i.name}</h5>
            <span>{i.address}</span>
        </li>)
    }

    return <React.Fragment>
        <div className="vchain-list position-relative">
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
                className="vchain-list-scroll list-group"
                options={{
                    wheelPropagation: false
                }}
            >
                <ul className="vchain-list-wrapper media-list">{renderListVChain()}</ul>
            </PerfectScrollbar>
            <CreateVChain
                visible={isModalCreate}
                onClose={onCloseModalCreate}
            />
            <DetailVChain
                visible={isModalDetail}
                onClose={onCloseModalDetail}
                data={vchain}
            />
        </div>

    </React.Fragment>
}

const mapDispatchToProps = {
    getListVChain
}

const mapStateToProps = state => {
    return {
        listVChain: state.vchain.listVChain
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListVChain)