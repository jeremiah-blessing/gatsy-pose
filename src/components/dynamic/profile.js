import React, { useState } from 'react'
import { connect } from 'react-redux'
import AvatarViewer from '../avatarViewer'
import Navbar from '../navbar'
import { Link } from '@reach/router'

import RedMale from '../../images/red-male-esatta.svg'
import CameraIcon from '../../images/photo-white.svg'

const Profile = ({ user, navigate }) => {
  const [outlineStyle, setOutlineStyle] = useState('bg-button.red text-white')
  const [threeDStyle, setThreeDStyle] = useState('bg-button.grey text-black')
  const [activeButton, setActiveButton] = useState('outline')
  const [removeBtns, setRemoveBtns] = useState(false)

  const handleOutline = () => {
    setThreeDStyle('bg-button.grey text-black')
    setOutlineStyle('bg-button.red text-white')
    setActiveButton('outline')
  }

  const handle3D = () => {
    setOutlineStyle('bg-button.grey text-black')
    setThreeDStyle('bg-button.red text-white')
    setActiveButton('3D')
  }

  const displayContent = () => {
    return activeButton === 'outline' ? <img className='w-4/5 px-4 my-8 sm:mt-20 m-auto max-w-md retinaImageLarge' alt="outline" src={RedMale} /> : <AvatarViewer />
  }

  if (!user.isSignedIn) navigate('/home/sign-in')

  return (
    <div>
      <Navbar setRemoveBtns={setRemoveBtns} text="Logout" url="/home/" />
      <div className={`${removeBtns ? 'hidden' : 'block'}`}>
        <div className="mt-4 sm:mt-8 w-1/2 flex justify-between m-auto font-Futura font-bold text-base">
          <button className={`w-2/5 ${outlineStyle}`} onClick={() => handleOutline()}>
            outline
          </button>
          <button className={`w-2/5 ${threeDStyle}`} onClick={() => handle3D()}>
          avatar
          </button>
        </div>
        {displayContent()}

        <p className="text-center md:mt-8 mb-4 font-Futura text-base">
          <b>Bodyshape:</b> Trapezoid
        </p>
        <Link to="/home/browse-brands">
          <div className="flex justify-center mb-2">
            <button className="text-center w-64 bg-input.border rounded-2xl h-12 retinaButtonLarge">
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Browse Our brands
              </span>
            </button>
          </div>
        </Link>
        <Link to="/home/step-one?alert=rescan">
          <div className="flex justify-center mb-4">
            <button className="text-center w-64 bg-button.red  rounded-2xl h-12 retinaButtonLarge">
              <img alt="camera-icon" className="w-5 inline-block mr-2 mb-2" src={CameraIcon} />
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Rescan
              </span>
            </button>
          </div>
        </Link>
        <p className={`${activeButton === 'outline' ? 'w-full' : 'hidden'} absolute opacity-50 bottom-1vh text-center text-sm text-light.grey font-Roboto tracking-1.6`}>
          Last scanned: 28 Jun 2020
        </p>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps)(Profile)