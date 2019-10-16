import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Head from './head'
import { getData } from '../redux/reducers/users'

const Dummy = (props) => {
  const [counter] = useState(4)
  const { getData: getDataProps } = props
  useEffect(() => {
    getDataProps()
  }, [getDataProps])
  return (
    <div>
      <Head title="Hello" />
      <div> {JSON.stringify(props.isRequesting)} </div>
      <div> Hello World { counter } </div>
      <table>
        <tr>
          <td>Avatar</td>
          <td>Name</td>
          <td>Age</td>
          <td>Country</td>
          <td>City</td>
          <td>Phone</td>
          <td>Title</td>
          <td>Job</td>
          <td>IP</td>
          <td>Salary</td>
        </tr>
        {
          props.users.map(user => (
            <tr>
              <td>{user.Avatar}</td>
              <td>{user.Name}</td>
              <td>{user.Age}</td>
              <td>{user.Country}</td>
              <td>{user.City}</td>
              <td>{user.Phone}</td>
              <td>{user.Title}</td>
              <td>{user.Job}</td>
              <td>{user.IP}</td>
              <td>{user.Salary}</td>
            </tr>
          ))
        }
      </table>
      <img src={`/tracker.${counter}.gif`} alt="tracker" />
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
