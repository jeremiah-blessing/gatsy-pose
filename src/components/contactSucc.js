import React from 'react'
import { connect } from 'react-redux'
import FeedbackSuccMale from '../images/red-sent-feedback-esatta.svg'
import FeedbackSuccFemale from '../images/blue-thank-you-esatta.svg'

const ContactSucc = ({ measure, handleCloseClick, handleCloseMenuItem }) => {
  const getImage = () => measure.gender ? FeedbackSuccMale : FeedbackSuccFemale

  const handleDoneClick = () => {
    handleCloseClick()
    handleCloseMenuItem()
  }

  return (
    <div className="bg-white z-30">
      <p className="w-full text-center font-Georgia font-bold text-4xl sm:mt-12 sm:mb-4">
        Message Sent!
      </p>
      <img className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" alt="contact-us" src={getImage()} />
      <p className="mx-8 mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        Thank you for your message. We will endeavour to respond to you as soon as possible.
        Our standard response time is 24 hours.
      </p>
      <div className="fixed sm:bottom-3vh w-full z-0">
        <div className="flex justify-center">
          <button
            className="text-center w-64 h-12 bg-button.red rounded-2xl retinaButtonLarge"
            onClick={() => handleDoneClick()}
          >
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Back To Home
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  measure: state.measure
})

export default connect(mapStateToProps)(ContactSucc)
