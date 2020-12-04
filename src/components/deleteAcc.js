import React, { useState } from 'react'
import { connect } from 'react-redux'
import RedContact from '../images/red-contact-esatta.svg'
import CloseIconSvg from '../images/x-svg.svg'
import { deleteAcc } from '../store/thunk'

const DeleteAccount = ({ user, onConfirmClicked, handleCloseClick, handleCloseMenuItem }) => {
  const [showPopup, setShowPopup] = useState('hidden')

  const handleDoneClick = () => {
    handleCloseClick()
    handleCloseMenuItem()
  }
  return (
    <div className="z-30 sm:mt-40">
      <img alt="hair" className="h-24 w-1/4 m-auto" src={RedContact} />
      <p className="w-full text-center font-Georgia font-bold text-4xl my-4">
        We are sorry to see you go
      </p>

      <p className="mx-8 mt-10 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        Deleting your account will remove all your scans from our database, as well as all authorizations.
      </p>

      <div className="fixed bottom-3vh w-full z-0">
        <div className="flex justify-center">
          <button
            className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge"
            onClick={() => onConfirmClicked({ token: user.token, setShowPopup })}
          >
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Confirm Account Deletion
            </span>
          </button>
        </div>
      </div>

      <div className={`absolute top-25vh w-full text-center z-40 ${showPopup}`}>
        <div className="w-4/6 bg-popup.blue h-64 m-auto rounded-lg border-4 border-popup.red.border relative">
          <img
            className="h-10 w-6 ml-auto mr-4"
            alt="close-icon"
            src={CloseIconSvg}
            onClick={() => setShowPopup('hidden')}
          />
          <p className="text-white mt-4 mx-2">
            Your account has been deleted. Thank you for trying Esatta Fit.
          </p>
          <div className="absolute w-full text-center bottom-0">
            <button
              className="h-12 bg-white rounded-full w-4/5 font-Roboto text-xl mb-8"
              onClick={() => handleDoneClick()}
            >
              Done
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
  onConfirmClicked: (token) => dispatch(deleteAcc(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount)