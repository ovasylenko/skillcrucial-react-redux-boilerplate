import React from 'react'
import { Link } from 'react-router-dom'

import Head from './head'

const Main = () => {
  return (
    <div>
      <Head title="Hello" />
      <div id="title">Main</div>
      <Link to="/dashboard/profile/fb1209b1-fabc-4e52-bd8e-a9bf47ba392"> Go To Profile </Link>
      <Link to="/dashboard"> Go To Root </Link>
    </div>
  )
}

Main.propTypes = {}

export default Main
