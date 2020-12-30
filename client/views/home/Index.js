import React from 'react'
import { connect } from 'react-redux'
import { getProfile } from "../../redux/actions/auth/loginActions"
import HomeDeveloper from "../token-dev/TokenDev"
import HomeAdmin from "./HomeAdmin"

const HomePage = (props) => {
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