import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Head from './head'
import { getData } from '../redux/reducers/users'

const Dummy = (props) => {
  const [counter] = useState(0)
  const { getData: getDataProps } = props
  useEffect(() => {
    getDataProps();
  }, [getDataProps])
  return (
    <div>
      <Head title="Hello" />
      <div> Hello World from Krasnodar{counter} </div>
      <div> {JSON.stringify(props.users)} </div>
      <ing src={`/tracker/${counter}.gif`} alt="tracker" />
    </div>
  )
}

Dummy.propTypes = {}

const mapStateToProps = state => ({
  users: state.users.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dummy)
