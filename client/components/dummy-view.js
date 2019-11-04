import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getData } from '../redux/reducers/users'
import Head from './head'


const Dummy = (props) => {
  const [counter] = useState(4)
  const [pageIndex, setPageIndex] = useState(0)
  const [showText, changeShowText] = useState({
    toggled1: true,
    toggled2: false
  })
  const toggleSmth = () => {
    changeShowText({
      toggled1: !showText.toggled1,
      toggled2: !showText.toggled2
    })
  }
  const { getData: getDataProps } = props
  useEffect(() => {
    getDataProps(pageIndex)
  }, [getDataProps, pageIndex])
  return (
    <div>
      <Head title="Hello" />
      {
        showText.toggled1 && (
          <div>Text is shown 1</div>
        )
      }
      {
        showText.toggled2 && (
          <div>Text is shown 2</div>
        )
      }
      <button type="button" onClick={toggleSmth}>Toggle me gently</button>
      <div> {JSON.stringify(props.isRequesting)} </div>
      <div> Hello World { counter }</div>
      <div> List: { pageIndex + 1 } From: {props.users.length}</div>
      <table>
        <thead>
          <tr>
            <th>NN</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Age</th>
            <th>Country</th>
            <th>City</th>
            <th>Phone</th>
            <th>Title</th>
            <th>Job</th>
            <th>IP</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {
            !props.isRequesting ? props.users.map((user, ind) => (
              <tr>
                <td>{pageIndex * 10 + ind + 1}</td>
                <td><img src={user.Avatar} width="40" alt={user.Name} /></td>
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
            )) : ''
          }
        </tbody>
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

const mapStateToProps = (state) => ({
  users: state.users.list,
  isRequesting: state.users.isRequesting
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ getData }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dummy)
