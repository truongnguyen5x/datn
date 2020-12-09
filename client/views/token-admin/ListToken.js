import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { Button } from "reactstrap"
import { Plus } from 'react-feather'
import Sidebar from "react-sidebar"
import { getListToken } from "../../redux/actions/token-admin"

import PerfectScrollbar from "react-perfect-scrollbar"
import TokenSidebar from "./TokenSidebar"
import { ContextLayout } from "../../utility/context/Layout"
const mql = window.matchMedia(`(min-width: 992px)`)
import "../../assets/scss/pages/token.scss"

const ListToken = (props) => {
    const [isModalCreate, openModalCreate] = useState(false)
    const [isModalDetail, openModalDetail] = useState(false)
    const [isModalUpdate, openModalUpdate] = useState(false)
    const [sidebarDocked, setSidebarDocked] = useState(mql.matches)

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
        <div className="token-list position-relative">
            <ContextLayout.Consumer>
                {context => (
                    <Sidebar
                        sidebar={
                            <TokenSidebar
                                handleComposeSidebar={handleComposeSidebar}
                                mainSidebar={e => setSidebarOpen(e)}
                                routerProps={props}
                            />
                        }
                        docked={sidebarDocked}
                        open={sidebarOpen}
                        sidebarClassName="sidebar-content token-app-sidebar d-flex"
                        touch={false}
                        contentClassName="sidebar-children"
                        pullRight={context.state.direction === "rtl"}>

                    </Sidebar>
                )}
            </ContextLayout.Consumer>
            <div className="content-right">
                <PerfectScrollbar
                    className="token-list-scroll list-group"
                    options={{
                        wheelPropagation: false
                    }}
                >
                    <ul className="token-list-wrapper media-list">{renderListToken()}</ul>
                </PerfectScrollbar>
            </div>


        </div>

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