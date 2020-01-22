import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const Startup = (props) => {
  useEffect(() => {})

  return <>{props.children}</>
}

Startup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

Startup.defaultProps = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Startup))
