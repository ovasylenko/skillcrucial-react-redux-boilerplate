import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Switch, Route } from 'react-router-dom'
import Head from './head'
import Main from './main'
import User from './user'
import Dashboard from './dashboard'

const Home = () => {
  return (
    <div>
      <Head />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <Switch>
            <Route exact path="/dashboard/profile/:user" component={() => <User />} />
            <Route exact path="/dashboard/main" component={() => <Main />} />
            <Route exact path="/dashboard" component={() => <Dashboard />} />
          </Switch>
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
