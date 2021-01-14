import React from "react"
import { connect } from 'react-redux'
import "../../../assets/scss/components/app-loader.scss"

const SpinnerComponent = props => {
  return props.loading ? <div className="global-loading">
    <div className="loading">
      <div className="effect-1 effects"></div>
      <div className="effect-2 effects"></div>
      <div className="effect-3 effects"></div>
    </div>
  </div> : null
}

const mapStateToProps = (state) => {
  return {
    loading: state.home.loading
  }
}

export default connect(mapStateToProps, {})(SpinnerComponent)
