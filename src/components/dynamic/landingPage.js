import React, { useState} from 'react'
import { connect } from 'react-redux'
import Navbar from '../navbar'
import SelfieEsatta from '../../images/selfie-esatta.svg'
import { Link } from 'gatsby'

const LandingPage = ({ user }) => {
  const [removeBtns, setRemoveBtns] = useState(false)

  const displayNavbar = () => {
    if (user.isSignedIn) {
      return <Navbar setRemoveBtns={setRemoveBtns} text="Profile" url="/home/profile" />
    } else {
      return <Navbar setRemoveBtns={setRemoveBtns} text="Login" url="/home/sign-in" />
    }
  }
  return (
    <div>
      {displayNavbar()}
      <div className={`${removeBtns ? 'hidden' : 'block'}`}>
        <img
          alt="Selfie"
          className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge"
          src={SelfieEsatta}
        />
        <h1 className="mx-8 text-center text-3xl sm:text-4xl font-Georgia font-bold">
          Create your <span className="text-esatta.red">Fit</span>
        </h1>
        <p className="mx-8 mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
          Accurately scan your body with only two pictures and find your perfect size.
        </p>
        
        <Link className="absolute bottom-3vh w-full z-0" to="/home/step-one">
          <div className="flex justify-center">
            <button className="text-center w-64 h-12 bg-button.red retinaButtonLarge">
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Start
              </span>
            </button>
          </div>
        </Link>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps)(LandingPage)
