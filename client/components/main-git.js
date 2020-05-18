import React from 'react'
import Head from './head'
import { Link } from 'react-router-dom'
import UserPage from './user'

const Maingit = () => {
  return (
    <div>
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          This is Maingit component
          <p />
          <input type="text" id="input-field" className="text-black font-bold rounded-lg shadow-lg p-2" />
          <button
            type="button"
            id="search-button"
            className="border bg-yellow-900 font-bold p-2 rounded-lg"
            onClick={

            }
          >
            Let`s go
          </button>
        </div>
      </div>
    </div>
  )
}

Maingit.propTypes = {}

export default React.memo(Maingit)
