import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux'
import { getData } from '../redux/reducers/users'
import Head from './head'

const Dummy = (props) => {
  const [counter] = useState(4)
  const { getData: getDataProps } = props
  useEffect(() => {
    getDataProps();
  }, [getDataProps])
  return (
    <div>
      <Head title="Hello" />
      <div> {props.isRequesting ? 'Your data is loading' : ''}</div>
      <div> Hello World Dummy{counter} </div>
      <a href="/dashboard">Go to Dashboard HREF</a>
      <br />
      <Link to="/dashboard">Go to Dashboard LINK</Link>
    </div>
  )
}

Dummy.propTypes = {}

const mapStateToProps = state => ({
  users: state.users.list,
  isRequesting: state.users.isRequesting
})

const mapDispatchToProps = dispatch => bindActionCreators({ getData }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dummy)
