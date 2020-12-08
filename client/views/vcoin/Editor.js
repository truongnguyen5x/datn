import React, { useState, useEffect } from 'react'
import { Treebeard, decorators } from "react-treebeard"
import { Row, Col, Input } from 'reactstrap'
import { getFile } from "../../redux/actions/file"
import { connect } from 'react-redux'
import { styleLight, styleDark } from "../../extensions/treeview/Styles"
// eslint-disable-next-line
import Prism from "prismjs"



const Editor = props => {
    useEffect(() => {
        Prism.highlightAll();
        (async () => {
            let pm = await Promise.all([props.getFile(1), props.getFile(2)])
            data.children = pm.map(i => {
                return {
                    name: i.data.path,
                    code: i.data.code,
                    id: i.data.id
                }
            })
            setData(Object.assign({}, data))
            props.onChange(data.children)
        })()
    }, [])
    const [cursor, setCursor] = useState()
    const [data, setData] = useState({ name: 'root', id: 0, toggled: true, children: [] })


    const onToggle = (node, toggled) => {
    
        if (cursor) {
            cursor.active = false
        }
        node.active = true
        if (node.children) {
            node.toggled = toggled
        } else {
            setCursor(node)
        }
        setData(Object.assign({}, data))
    }

    return <React.Fragment>
        <Row className="mb-2">
            <Col md={3}>
                <Treebeard
                    data={data}
                    style={styleLight}
                    onToggle={onToggle}

                    decorators={decorators}
                    animations={false}
                />
            </Col>
            <Col md={9}>
                <Input
                    type="textarea"
                    rows={20}
                    value={cursor?.code || ""}
                />
            </Col>
        </Row>

    </React.Fragment>
}

const mapDispatchToProps = {
    getFile
}

export default connect(null, mapDispatchToProps)(Editor)