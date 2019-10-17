import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Head from './head'
import { getData } from '../redux/reducers/users'

const Dummy = (props) => {
  const [counter] = useState(4)
  const [pageIndex, setPageIndex] = useState(0)
  const { getData: getDataProps } = props
  useEffect(() => {
    getDataProps(pageIndex)
  }, [getDataProps, pageIndex])
  return (
    <div>
      <Head title="Hello" />
      <div> {JSON.stringify(props.isRequesting)} </div>
      <div> Hello World { counter }</div>
      <div> List: { pageIndex + 1 } From: {props.users.length}</div>
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
      <button
        type="button"
        onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => setPageIndex(Math.min(9, pageIndex + 1))}
      >
        Next
      </button>
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
