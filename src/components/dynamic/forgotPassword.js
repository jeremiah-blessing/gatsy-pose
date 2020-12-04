import React, { useState } from 'react'
import { connect } from 'react-redux'
import Navbar from '../navbar'

import RedPass from '../../images/red-password-esatta.svg'
import { forgotPassword } from '../../../src/utils/utils'

const ForgotPassword = ({ navigate }) => {
  const [email, setEmail] = useState('')
  const [removeBtns, setRemoveBtns] = useState(false)

  const handleEmailChange = (e) => setEmail(e.target.value)

  const handleSubmit = async () => {
    await forgotPassword(email, navigate)
  }

  return (
    <div>
      <Navbar setRemoveBtns={setRemoveBtns} text="Sign up" url="/home/sign-up" />
      <div className={`${removeBtns ? 'hidden' : 'block'}`}>
        <h1 className="mx-6 text-center text-4xl font-Georgia font-bold sm:my-4">
          Forgot password
        </h1>
        <img className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" alt="login" src={RedPass} />
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          className="w-4/5 mx-10 border h-10 p-4 rounded-lg my-2 sm:my-4"
        />
        <div className="absolute bottom-3vh w-full z-0">
          <div className="flex justify-center">
            <button
              className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge"
              onClick={async () => await handleSubmit()}
            >
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Reset password
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

export default connect(mapStateToProps)(ForgotPassword)
