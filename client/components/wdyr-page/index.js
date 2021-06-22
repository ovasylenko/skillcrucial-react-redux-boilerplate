import React, { useState } from 'react'
import Head from '../head'

import Info from './info'
import DummyRender from './dummy-render'

const WdyrPage = () => {
  const [obj, updateObj] = useState({
    message: 'hey! this message is immutable',
    counter: 1
  })

  return (
    <div className="flex flex-col items-center justyfy-start w-full p-3">
      <Head title="Why Did You Render" />
      <Info />

      <div className="flex flex-col items-start justify-start my-4">
        <button
          className="bg-green-200 hover:bg-green-300 px-2 py-1 rounded"
          type="button"
          onClick={() => updateObj({ ...obj, counter: obj.counter + 1 })}
        >
          dummy increment
        </button>
        <DummyRender obj={obj} />
      </div>
    </div>
  )
}

WdyrPage.propTypes = {}

export default WdyrPage
