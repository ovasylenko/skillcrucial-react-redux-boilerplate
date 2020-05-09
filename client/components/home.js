import React from 'react'
import { Route } from 'react-router-dom'
import Dashboard from './dashboard'
import Main from './main'
import Profile from './profile'

import Header from './header'

const Home = () => {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <Route exact path="/dashboard" component={() => <Dashboard />} />
          <Route exact path="/dashboard/main" component={() => <Main />} />
          <Route exact path="/dashboard/profile/:username" component={() => <Profile />} />
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default React.memo(Home)
