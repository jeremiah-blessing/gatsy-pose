import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { login } from '../../store/thunk'
import Navbar from '../navbar'
import Alert from '../alert'
import Facebook from '../facebook'
import Google from '../google'

import RedLogin from '../../images/red-login-esatta.svg'
import AppleIcon from '../../images/apple-icon.png'
import CheckedCheckbox from '../../images/checkboxChecked.png'
import UncheckedCheckbox from '../../images/checkboxUnchecked.png'
import { Link } from 'gatsby'

const SignIn = ({ user, onLoginPressed, navigate }) => {
  if (user.isSignedIn) {
    user.measurements ? navigate('/home/profile') : navigate('/home/')
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [stayLogged, setStayLogged] = useState(false)
  const [errorBorder, setErrorBorder] = useState('')
  const [removeBtns, setRemoveBtns] = useState(false)

  const handleEmailChange = (e) => setEmail(e.target.value)
  const handlePassChange = (e) => setPassword(e.target.value)
  const handleSubmit = () => {
    onLoginPressed({ email, password, navigate })
  }

  const getCheckboxImage = () => stayLogged ? CheckedCheckbox : UncheckedCheckbox

  const checkErrorBorder = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search
      const params = search && new URLSearchParams(search)
      const alert = params && params.get('alert')
      if (alert === 'login_fail') setErrorBorder('border-alert.red')
    }
  }

  useEffect(() => {
    checkErrorBorder()
  })

  return (
    <div>
      <Navbar setRemoveBtns={setRemoveBtns} text="Sign up" url="/home/sign-up" />
      <div className={`${removeBtns ? 'hidden' : 'block'}`}>
        <Alert />
        <h1 className="mx-8 sm:mt-4 text-center text-4xl font-Georgia font-bold">
          Login
        </h1>
        <img className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" alt="login" src={RedLogin} />
        <div className="flex justify-center mb-2 sm:mb-4">
          <Facebook navigate={navigate}/>
          <Google navigate={navigate} />
          <img className="w-12 h-12 mx-4" alt="login" src={AppleIcon} />
        </div>
        <label>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className={`w-4/5 mx-10 border h-10 p-4 rounded-lg mb-2 sm:mb-4 focus:outline-none focus:border-esatta.red ${errorBorder}`}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePassChange}
            className={`w-4/5 mx-10 border h-10 p-4 rounded-lg mb-2 sm:mb-4 focus:outline-none focus:border-esatta.red ${errorBorder}`}
          />
        </label>
        <div className="flex w-4/5 mx-10 justify-between font-Georgia text-sm">
          <div onClick={() => setStayLogged(!stayLogged)}>
            <img alt="checkbox" className="w-5 h-5 inline mr-4" src={getCheckboxImage()} />
            <p className="inline-block">Stay logged in</p>
          </div>
          <Link to='/home/forgot-password'>
            <p className="underline">
              Forgot Password?
            </p>
          </Link>
        </div>
        <div className="absolute bottom-0 bottom-3vh w-full z-0">
          <div className="flex justify-center">
            <button
              className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge"
              onClick={() => handleSubmit()}
            >
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Login
                  </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  onLoginPressed: (credentials) => dispatch(login(credentials)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
