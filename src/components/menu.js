import React, { useState } from 'react'
import { connect } from 'react-redux'
import RedWall from '../images/red-help-esatta.svg'
import CameraIcon from '../images/photo.svg'
import CloseIcon from '../images/close-icon.png'
import CloseIconSvg from '../images/x-svg.svg'
import { Link } from 'gatsby'
import Terms from './terms'
import Privacy from './privacy'
import Contact from './contact'
import Feedback from './feedback'
import FeedbackSucc from './feedbackSucc'
import ContactSucc from './contactSucc'
import DeleteAcc from './deleteAcc'
import LanguagePage from './languagePage'
import SystemOfUnits from './systemOfUnits'
import DataSharing from './dataSharing'
import Notifications from './notifications'

const MENU_ITEMS = [
  {
    id: 1,
    text: 'Data Sharing',
  },
  {
    id: 2,
    text: 'Notifications',
  },
  {
    id: 3,
    text: 'Language',
  },
  {
    id: 4,
    text: 'System of Units',
  },
  {
    id: 5,
    text: 'Terms of Use',
  },
  {
    id: 6,
    text: 'Privacy Notice',
  },
  {
    id: 7,
    text: 'Delete Account',
  },
  {
    id: 8,
    text: 'Contact & Feedback',
  },
]

const Menu = ({ user, handleCloseClick }) => {
  const [itemToDisplay, setItemToDisplay] = useState(0)
  const [showMenuItem, setShowMenuItem] = useState('hidden')
  const [showMenu, setShowMenu] = useState('block')
  const [showPopup, setShowPopup] = useState('hidden')

  const handleDisplay = (itemId) => {
    if (itemId === 8) {
      setShowPopup('block')
    } else {
      setItemToDisplay(itemId)
      setShowMenuItem('block')
      setShowMenu('hidden')
    }
  }

  const handleDisplayContact = (itemId) => {
    setShowPopup('hidden')
    setItemToDisplay(itemId)
    setShowMenuItem('block')
    setShowMenu('hidden')
  }

  const handleCloseMenuItem = () => {
    setShowMenuItem('hidden')
    setShowMenu('block')
  }

  const diplayMenu = () => {
    return MENU_ITEMS.map(item => {
      if (item.id === 7 && !user.isSignedIn) return
      return (
        <button
          className="w-full"
          key={item.id}
          onClick={() => handleDisplay(item.id)}
        >
          <p className="py-0.6vh font-Roboto text-13px leading-3vh tracking-1.6 text-left">
            {item.text}
          </p>
          <hr />
        </button>
      )
    })
  }

  const menuItem = () => {
    switch (itemToDisplay) {
      case 1:
        return <DataSharing />
      case 2:
        return <Notifications />
      case 3:
        return <LanguagePage />
      case 4:
        return <SystemOfUnits />
      case 5:
        return <Terms />
      case 6:
        return <Privacy />
      case 7:
        return <DeleteAcc handleCloseClick={handleCloseClick} handleCloseMenuItem={handleCloseMenuItem} />
      case 8:
        return <Contact handleDisplay={handleDisplay} />
      case 9:
        return <Feedback handleDisplay={handleDisplay} />
      case 10:
        return <FeedbackSucc handleCloseClick={handleCloseClick} handleCloseMenuItem={handleCloseMenuItem} />
      case 11:
        return <ContactSucc handleCloseClick={handleCloseClick} handleCloseMenuItem={handleCloseMenuItem} />
      default:
        return <p>{itemToDisplay}</p>
    }
  }

  const menu = diplayMenu()
  return (
    <div className="bg-white">
      <p className="w-full text-center font-Georgia font-bold text-4xl sm:mb-4">
        Help & Settings
      </p>
      <img alt="help" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={RedWall} />
      <div className={`${showMenu}`}>
        <div className="mt-2 mx-12">
          <hr />
          <Link to='/home/step-one?alert=rescan' className="w-full">
            <img alt="camera-icon" className="w-6% inline-block mr-2" src={CameraIcon} />
            <p className="inline-block py-1 font-Roboto text-sm font-bold leading-6 tracking-1.6">
              Rescan
            </p>
            <hr />
          </Link>
          {menu}
        </div>
        <p className="mt-4 w-full text-center text-xs tracking-1.6 leading-6 font-Roboto text-light.grey">
          Build Id: com.esatta.fit <br/>
          App Version : 1.06 <br/>
          Git Hash: -
        </p>
      </div>
      <div className={`absolute top-0 w-full h-screen bg-white z-10 block ${showMenuItem}`}>
        <div className="inline-flex mb-8">
          <img
            className="absolute w-10 top-0 right-0 mr-1 md:mr-5 md:mt-5 mt-2"
            alt="close-icon"
            src={CloseIcon}
            onClick={() => handleCloseMenuItem()}
          />
        </div>
        {menuItem()}
      </div>
      <div className={`absolute top-25vh w-full text-center z-20 ${showPopup}`}>
        <div className="w-4/6 bg-popup.blue h-33vh m-auto rounded-lg border-4 border-popup.red.border">
          <img
            className="h-10 w-6 ml-auto sm:mt-2 mr-4"
            alt="close-icon"
            src={CloseIconSvg}
            onClick={() => setShowPopup('hidden')}
          />
          <button
            className="h-10 sm:h-16 bg-white rounded-full w-3/4 font-Roboto text-xl my-4 sm:my-6"
            onClick={() => handleDisplayContact(8)}
          >
            Contact Us
          </button>
          <button
            className="h-10 sm:h-16 bg-white rounded-full w-3/4 font-Roboto text-xl"
            onClick={() => handleDisplayContact(9)}
          >
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps)(Menu)
