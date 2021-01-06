import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getProfile } from "../../redux/actions/auth/loginActions"
import TokenDev from "../token-dev/TokenDev"
import ListVcoin from "./ListVcoin"



const HomePage = (props) => {
    useEffect(() => {
        props.getProfile()
    }, [])

    if (props.role == 'admin') {
        return  <ListVcoin />
    } else if (props.role == 'editor') {
        return <TokenDev />
    } else {
        return <></>
    }
}




const mapDispatchToProps = {
    getProfile
}

const mapStateToProps = state => {
    return {
        role: state.auth.login.userRole
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)