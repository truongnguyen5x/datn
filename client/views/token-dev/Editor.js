import React, { useState, useEffect } from "react"
import { connect } from "react-redux"

import { Input, Label, Card, CardHeader, CardBody, Button, Row, Col, FormGroup, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { X, ArrowLeft, Home, Briefcase, Image, Folder, Box, Layers } from "react-feather"
import classnames from "classnames"


const Editor = props => {

    const [activeFile, setActiveFile] = useState(0)
    const toggle = tab => {
        if (activeFile !== tab) {
            setActiveFile(tab)
        }
    }

    useEffect(() => {
        // if (props.source.length > 0) {
        //     setActiveFile(0)
        // }
    }, [props.source])

    const onChangeCode = (idx, value) => {
        props.source[idx].code = value.target.value
        props.onChangeCode([...props.source])
    }

    return <div className="nav-vertical">
        <Nav tabs className="nav-left">
            {
                props.source.map((i, idx) => {
                    return <NavItem key={idx}>
                        <NavLink
                            className={classnames({
                                active: activeFile === idx
                            })}
                            onClick={() => {
                                toggle(idx)
                            }}
                        >
                            {i.path}
                        </NavLink>
                    </NavItem>
                })
            }

        </Nav>
        <TabContent activeTab={activeFile} className="mb-1">
            {
                props.source.map((i, idx) => {
                    return <TabPane tabId={idx} key={idx}>
                        <Input
                            onChange={(e) => onChangeCode(idx, e)}
                            value={props.source[idx].code}
                            type="textarea"
                            rows={20}
                        />
                    </TabPane>
                })
            }
        </TabContent>
    </div>
}

export default Editor