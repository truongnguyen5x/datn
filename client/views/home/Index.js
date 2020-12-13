import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import HomeAdmin from "./HomeAdmin"
import HomeDeveloper from "./HomeDeveloper"

import { getProfile } from "../../redux/actions/auth/loginActions"

const HomePage = (props) => {

    useEffect(() => {
        props.getProfile()
    }, [])
    return props.role == "admin" ? <HomeAdmin /> : <HomeDeveloper />
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