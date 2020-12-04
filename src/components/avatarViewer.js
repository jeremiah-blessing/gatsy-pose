import React, { useEffect } from 'react'
import { setup } from '../3d-libraries/displayAvatar'

const AvatarViewer = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') setup()
  })
  return (
    <div id="avatar-viewer" className='mt-6' />
  )
}

export default AvatarViewer
