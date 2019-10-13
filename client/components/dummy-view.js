import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Head from './head'
import { getData } from '../redux/reducers/users'

const Dummy = (props) => {
  const [counter] = useState(3)
  const [pageIndex, setPageIndex] = useState(0)
  const { getData: getDataProps } = props
  useEffect(() => {
    getDataProps(pageIndex);
  }, [getDataProps, pageIndex])
  return (
    <div>
      <Head title="Hello" />
      <div> {JSON.stringify(props.isRequesting)} </div>
      <div> Hello World {counter}
        <tr>Elements on page {props.users.length} Total quantity of elements </tr>
      </div>
      <div> Page # {pageIndex + 1} out of  </div>
      <table>
        <tr>
          <td>Name</td>
          <td>email</td>
          <td>company</td>
          <td>salary</td>
          <td>age</td>
          <td>city</td>
          <td>countryOfBirth</td>
          <td>phone</td>
        </tr>
        {
          !props.isRequesting && props.users.map(user => (
            <tr>
              <td>{user.Name}</td>
              <td>{user.email}</td>
              <td>{user.company}</td>
              <td>{user.salary}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td>{user.countryOfBirth}</td>
              <td>{user.phone}</td>
            </tr>
          ))
        }
      </table>
      <button
        type="button"
        onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
      >
        Previous page
      </button>
      <button
        type="button"
        onClick={() => setPageIndex(pageIndex + 1)}
      >
        Next page
      </button>
      <tr>
        <button
          type="button"
          onClick={() => setPageIndex(pageIndex + 1)}
        >
        First page
        </button>
        <button
          type="button"
          onClick={() => setPageIndex(pageIndex)}
        >
        Last page
        </button>
      </tr>
      <ing src={`/tracker/${counter}.gif`} alt="tracker" />
    </div>
  )
}

Dummy.propTypes = {}

const mapStateToProps = state => ({
  users: state.users.list,
  isRequesting: state.users.isRequesting
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dummy)
