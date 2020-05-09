import React from 'react'
import Header from './header'

const Home = () => {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          {/* add your routes here */}
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default React.memo(Home)
