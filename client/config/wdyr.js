import React from 'react'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOnDifferentValues: true,
    trackExtraHooks: [[require('react-redux/lib'), 'useSelector']]
  })
}
