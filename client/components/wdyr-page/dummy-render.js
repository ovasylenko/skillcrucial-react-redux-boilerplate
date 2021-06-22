import React from 'react'
import DummyMessage from './dummy-message'
import DummyCounter from './dummy-counter'

const DummyRender = ({ obj }) => {
  return (
    <div className="flex items-center my-4 justify-center">
      <div className="bg-indigo-800 hover:text-red-500 text-white font-bold rounded-lg border shadow-lg p-10">
        <DummyCounter counter={obj.counter} /> <br />
        <DummyMessage message={obj.message} />
      </div>
    </div>
  )
}

DummyRender.whyDidYouRender = true
export default DummyRender
