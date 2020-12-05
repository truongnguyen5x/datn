import React from 'react'
import { connect } from 'react-redux'
import HomeAdmin from "./HomeAdmin"
import HomeDeveloper from "./HomeDeveloper"

const HomePage = (props) => {
    return props.role == "admin" ? <HomeAdmin /> : <HomeDeveloper />
}

const mapDispatchToProps = {

}

const mapStateToProps = state => {
    return {
        role: state.auth.login.userRole
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)