import React, { useState } from 'react'
import { history } from '../redux'

const Main = () => {
  const [value, setValue] = useState('')
  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onClick = () => {
    history.push(`/${value}`)
  }
  return (
    <div>
      <div>{value}</div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-black font-bold rounded-lg border shadow-lg p-10">
          <input id="input-field" value={value} onChange={onChange} className="mr-3" type="text" />
          <button
            className="bg-indigo-300 text-green font-bold rounded-lg shadow-lg p-2"
            type="button"
            onClick={onClick} id="search-button"
          >
            Search
          </button>
        </div>
      </div>
    </div >
  )
}
Main.propTypes = {}

export default React.memo(Main)
