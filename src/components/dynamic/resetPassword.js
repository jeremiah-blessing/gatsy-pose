import React, { useState } from 'react'
import { connect } from 'react-redux'
import Navbar from '../navbar'

import RedLogin from '../../images/red-login-esatta.svg'
import { resetPassword } from '../../../src/utils/utils'

const ResetPassword = ({ navigate }) => {
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [validationStyle, setValidationStyle] = useState('opacity-0')
  const [validationText, setValidationText] = useState('')
  const [removeBtns, setRemoveBtns] = useState(false)

  const getToken = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search
      const params = search && new URLSearchParams(search)
      const token = params && params.get('token')
      return token
    }
  }

  const handlePassChange = (e) => setPassword(e.target.value)
  const handlePassConfChange = (e) => setPasswordConf(e.target.value)

  const handleSubmit = async () => {
    if (password === passwordConf && password ) {
      await resetPassword(password, getToken(), navigate)
    } else {
      if (!password) setValidationText('Please enter a password')
      if (password !== passwordConf) setValidationText('The passwords do not match')
      setValidationStyle('opacity-100')
    }
  }

  return (
    <div>
      <Navbar setRemoveBtns={setRemoveBtns} text="Sign up" url="/home/sign-up" />
      <p className={`text-white text-center text-xs font-Roboto bg-alert.red ${validationStyle}`}>
        {validationText}
      </p>
      <div className={`${removeBtns ? 'hidden' : 'block'}`}>
        <h1 style={{paddingTop: '1vh'}} className="mx-6 text-center text-3xl font-Georgia font-bold my-2 sm:my-4">
          Reset Password
        </h1>
        <img className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" alt="login" src={RedLogin} />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePassChange}
          className="w-4/5 mx-10 border h-10 p-4 rounded-lg mb-4"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={passwordConf}
          onChange={handlePassConfChange}
          className="w-4/5 mx-10 border h-10 p-4 rounded-lg mb-3"
        />
        <div className="absolute bottom-3vh w-full z-0">
          <div className="flex justify-center">
            <button
              className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge"
              onClick={async () => await handleSubmit()}
            >
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Reset Password
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps)(ResetPassword)