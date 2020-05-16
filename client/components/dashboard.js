import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      <div id="title"> Dashboard </div>
      <Link to="/dashboard/profile/46a02278-f502-4416-a401-707cfef5cc86"> Go To Profile </Link>
      <Link to="/dashboard/main"> Go To Main </Link>
    </div>
  )
}

Dashboard.propTypes = {}

export default Dashboard

// Внутри должно быть три элемента
// div с id="title" и текстом Dashboard
// ссылка(реакт) с навигацией /dashboard/profile/46a02278-f502-4416-a401-707cfef5cc86 и текстом "Go To Profile"
// ссылка(реакт) с навигацией /dashboard/main и текстом "Go To Main"
