// eslint-disable-next-line import/no-extraneous-dependencies
import whyDidYouRender from '@welldone-software/why-did-you-render'
import React from 'react'

if (process.env.NODE_ENV === 'development' && !!process.env.WDYR) {
  // @ts-ignore react version
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true
  })
}
