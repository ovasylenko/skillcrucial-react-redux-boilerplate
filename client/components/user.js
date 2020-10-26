import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, useParams } from 'react-router-dom'
import Head from './head'

const User = () => {
  const { user } = useParams()
  return (
    <div>
      <Head title="Hello" />
      <div id="title">Profile</div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <div id="username">{user}</div>
          <Link to="/dashboard/main"> Go To Main </Link>
          <Link to="/dashboard"> Go To Roor </Link>
        </div>
      </div>
    </div>
  )
}

User.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(User)
