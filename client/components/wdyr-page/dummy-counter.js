import React from 'react'

const DummyCounter = ({ counter }) => {
  return <span> counter: {counter} </span>
}

DummyCounter.whyDidYouRender = true
export default DummyCounter
