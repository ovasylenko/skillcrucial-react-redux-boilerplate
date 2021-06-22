import React from 'react'

const DummyMessage = ({ message }) => {
  return <span> message: {message} </span>
}

DummyMessage.whyDidYouRender = true
export default DummyMessage
