import React, { useState } from 'react'
import { Link } from 'gatsby'
import { connect } from 'react-redux'
import { logout } from '../store/thunk'

import EsattaLogo from '../images/esatta-logo.svg'
import MenuIcon from '../images/sidemenu.png'
import CloseIcon from '../images/close-icon.png'
import Menu from './menu'

const Navbar = ({ text, url, onLogoutPressed, setRemoveBtns, makeFixed }) => {
  const [showMenu, setShowMenu] = useState('hidden')

  const handleClick = () => {
    setShowMenu('block')
    setRemoveBtns(true)
  }

  const handleCloseClick = () => {
    setShowMenu('hidden')
    setRemoveBtns(false)
  }

  const leftButton = () => {
    if (text === 'Logout') {
      return (
        <button onClick={() => onLogoutPressed()}>
          <p className="font-Futura font-medium m-2 sm:mt-4">
            {text}
          </p>
        </button>
      )
    } else {
      return (<Link to={url}>
        <p className="font-Futura font-medium m-2 sm:mt-4">
          {text}
        </p>
      </Link>)
    }
  }

  return (
    <div className={`${makeFixed ? makeFixed : ''}`}>
      <div className="shadow-lg w-full bg-white flex justify-between h-10 sm:h-14 px-4 lg:px-8 z-0">
        <div className="w-1/3">
          {leftButton()}
        </div>
        <Link to="/home/profile" className="w-1/3 flex justify-center items-center">
          <img alt="Esatta Logo" className="h-7" src={EsattaLogo} />
        </Link>
        <div className="w-1/3 flex justify-end items-center">
          <button onClick={() => handleClick()} className="w-10" >
            <img alt="Menu Icon" src={MenuIcon} />
          </button>
        </div>
      </div>
      <div className={`absolute top-0 h-screen w-full bg-white z-10 ${showMenu}`}>
        <div className="inline-flex mb-8">
          <img
            className="absolute w-10 top-0 right-0 mr-1 md:mr-5 md:mt-5 mt-2"
            alt="close-icon"
            src={CloseIcon}
            onClick={() => handleCloseClick()}
          />
        </div>
        <Menu handleCloseClick={handleCloseClick} />
        
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  onLogoutPressed: () => dispatch(logout()),
})

export default connect(null, mapDispatchToProps)(Navbar)