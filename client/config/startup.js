import { useEffect } from 'react'
import PropTypes from 'prop-types'

const Startup = (props) => {
  useEffect(() => {}, [])

  return props.children
}

Startup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

export default Startup
