import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { signup } from '../../store/thunk'
import Alert from '../alert'
import Navbar from '../navbar'
import Facebook from '../facebook'
import Google from '../google'
import Terms from '../terms'
import Privacy from '../privacy'

import RedSignUp from '../../images/red-signup-esatta.svg'
import CloseIcon from '../../images/close-icon.png'
import CheckedCheckbox from '../../images/checkboxChecked.png'
import UncheckedCheckbox from '../../images/checkboxUnchecked.png'

import AppleIcon from '../../images/apple-icon.png'
import FacebookIcon from '../../images/facebook-icon.png'
import GoogleIcon from '../../images/google-icon.png'

const SignUp = ({ user, onSignUpPressed, navigate }) => {
  if (user.isSignedIn) navigate('/home/profile')
  const [email, setEmail] = useState(undefined)
  const [password, setPassword] = useState(undefined)
  const [confirmPassword, setConfirmPassword] = useState(undefined)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const [popup, setPopup] = useState('')
  const [showPopup, setShowPopup] = useState('hidden')

  const [passBorder, setPassBorder] = useState('')
  const [errorBorder, setErrorBorder] = useState('')
  const [removeBtns, setRemoveBtns] = useState(false)

  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePassChange = (e) => setPassword(e.target.value)
  const handleConfirmPassChange = (e) => setConfirmPassword(e.target.value)
  const handleSubmit = async () => {
    // PASS MISMATCH
    if (password !== confirmPassword) setPassBorder('border-alert.red')
    // Not agreeing to terms
    if (!agreeToTerms) navigate('/home/sign-up?alert=register_missing_terms')
    // missing fields
    if (!email || !password || !confirmPassword) navigate('/home/sign-up?alert=register_missing_fields')
    if (email && agreeToTerms && password === confirmPassword) onSignUpPressed({ email, password, navigate })
  }

  const getCheckboxImage = () => agreeToTerms ? CheckedCheckbox : UncheckedCheckbox
  const getFacebook = () => {
    if (agreeToTerms) {
      return <Facebook navigate={navigate} />
    } else {
      return (
        <img
          onClick={() => navigate('/home/sign-up?alert=register_missing_terms')}
          className="mx-4 h-12 w-12"
          alt="login"
          src={FacebookIcon}
        />
      )
    }
  }
  const getGoogle = () => {
    if (agreeToTerms) {
      return <Google navigate={navigate} />
    } else {
      return (
        <img
          onClick={() => navigate('/home/sign-up?alert=register_missing_terms')}
          className="mx-4 h-12 w-12"
          alt="login"
          src={GoogleIcon}
        />
      )
    }
  }

  const checkErrorBorder = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search
      const params = search && new URLSearchParams(search)
      const alert = params && params.get('alert')
      if (alert === 'register_missing_fields') setErrorBorder('border-alert.red')
    }
  }

  useEffect(() => {
    checkErrorBorder()
  })

  return (
    <div>
      <Navbar setRemoveBtns={setRemoveBtns} text="Login" url="/home/sign-in" />
      <div className={`${removeBtns ? 'hidden' : 'block'}`}>
        <Alert />
        <h1 className="mx-4 sm:mx-8 sm:mt-4 text-center text-3xl font-Georgia font-bold">
          Create an Account
        </h1>
        <img className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" alt="SignUp" src={RedSignUp} />
        <div className="flex justify-center mb-2 sm:mb-4">
          {getFacebook()}
          {getGoogle()}
          <img className="mx-4 h-12 w-12"
          alt="login" src={AppleIcon} />
        </div>
        <label>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className={`${errorBorder} w-4/5 mx-10 border h-10 p-4 rounded-lg mb-1 focus:outline-none focus:border-esatta.red`}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePassChange}
            className={`${passBorder} ${errorBorder} w-4/5 mx-10 border h-10 p-4 rounded-lg mb-1 focus:outline-none focus:border-esatta.red`}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={handleConfirmPassChange}
            className={`${passBorder} ${errorBorder} w-4/5 mx-10 border h-10 p-4 rounded-lg mb-1 focus:outline-none focus:border-esatta.red`}
          />
        </label>
        <div className="flex sm:mt-4 md:m-auto md:justify-center w-4/5 mx-10 justify-between font-Georgia text-sm">
          <div className="contents" onClick={() => setAgreeToTerms(!agreeToTerms)}>
            <img alt="checkbox" className="w-5 h-5 inline mr-4" src={getCheckboxImage()} />
            <p className="inline-block">
              Agree to&nbsp;
              <button
                onClick={() => {
                  setShowPopup('')
                  setPopup('terms')
                }}
              >
                <u>Terms of Use</u>
              </button>
              &nbsp;and our&nbsp;
              <button
                onClick={() => {
                  setShowPopup('')
                  setPopup('privacy')
                }}
              >
                <u>Privacy Notice</u>
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute sm:bottom-3vh w-full z-0">
        <div className="flex justify-center">
          <button
            className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge"
            onClick={async () => await handleSubmit()}
          >
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Register
              </span>
          </button>
        </div>
      </div>
      <div className={`${showPopup} absolute top-0 h-screen w-full bg-white z-20`}>
        <img
          className="absolute h-5vh w-10% ml-88% mt-1vh"
          alt="close-icon"
          src={CloseIcon}
          onClick={() => setShowPopup('hidden')}
        />
        {popup === 'terms' ? <Terms /> : <Privacy/>}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  onSignUpPressed: (credentials) => dispatch(signup(credentials)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
