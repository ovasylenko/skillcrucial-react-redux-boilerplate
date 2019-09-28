import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

const NotFound = props => (
  <div>
    <h1> 404: URL Is not found </h1>
    <button type="button" tabIndex="0" onClick={props.goRoot}>Go to root</button>
  </div>
);

NotFound.propTypes = {
  goRoot: PropTypes.func
}

NotFound.defaultProps = {
  goRoot: () => {},
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => bindActionCreators({
  goRoot: () => push('/')
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NotFound)
