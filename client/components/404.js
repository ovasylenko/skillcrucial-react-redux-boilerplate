import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

const NotFound = (props) => (
  <div className="container main-wrapper aligner">
    <div className="aligner-item text-center ">
      <h1 className="display-1">404</h1>
      <p className="lead text-gray-800 mb-5">Page Not Found</p>
      <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
      <br />
      <button
        className="btn btn-secondary btn-lg"
        type="button"
        tabIndex="0"
        onClick={props.goRoot}
      >
        {' '}
        Back to Dashboard
      </button>
    </div>
  </div>
)

NotFound.propTypes = {
  goRoot: PropTypes.func
}

NotFound.defaultProps = {
  goRoot: () => {}
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      goRoot: () => push('/')
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(NotFound)
