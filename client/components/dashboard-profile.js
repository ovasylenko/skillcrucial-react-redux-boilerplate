import React from 'react'
import { Link, useParams } from 'react-router-dom'

const DashboardProfile = () => {
  const { user } = useParams()
  return (
    <div>
      <div id="title"> Profile </div>
      <Link to="/dashboard"> Go To Root </Link>
      <Link to="/dashboard/main"> Go To Main </Link>
      <div id="username"> {user} </div>
    </div>
  )
}

DashboardProfile.propTypes = {}

export default DashboardProfile

/* Внутри должно быть четыре элемента
ссылка(реакт) с навигацией /dashboard и текстом "Go To Root"
ссылка(реакт) с навигацией /dashboard/main и текстом "Go To Main"
div с id="title" и текстом Profile
div c id="username" и текстом, которые берется из параметра роута(см лекцию) */
