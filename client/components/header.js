import React from 'react'
import { Link, useParams } from 'react-router-dom'

const Header = () => {
  const { username, repository } = useParams()

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6 text-white font-bold">
      <div id="repository-name">{repository || username || 'Welcome'}</div>
      {username && (
        <Link to="/" id="go-back">
          Go Home
        </Link>
      )}
      {repository && (
        <Link to={`/${username}`} id="go-repository-list">
          Go Repository List
        </Link>
      )}
    </nav>
  )
}

Header.propTypes = {}

export default React.memo(Header)
