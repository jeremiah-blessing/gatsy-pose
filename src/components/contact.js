import React, { useState } from 'react'
import RedContact from '../images/red-contact-esatta.svg'

const Contact = ({ handleDisplay }) => {
  const [contactType, setContactType] = useState('')
  const [feedback, setFeedback] = useState('')
  const handleContactChange = (e) => setContactType(e.target.value)
  const handleFeedbackChange = (e) => setFeedback(e.target.value)
  return (
    <div className="relative z-30">
      <p className="w-full text-center font-Georgia font-bold text-4xl sm:my-4">
        Contact us
      </p>
      <img className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto lg:retinaImageLarge" alt="contact-us" src={RedContact}/>
      <div className="text-center">
        <select
          name="contact-type"
          className="w-4/5 border h-10 rounded-lg mb-2 sm:mb-4 pl-4 focus:outline-none"
          onBlur={handleContactChange}
        >
          <option value="">Select contact type...</option>
          <option value="contact-1">Contact 1</option>
          <option value="contact-2">Contact 2</option>
          <option value="contact-3">Contact 3</option>
        </select>
        <textarea
          placeholder="Type your feedback here..."
          value={feedback}
          onChange={handleFeedbackChange}
          className="w-4/5 border h-32 sm:h-48 p-4 rounded-lg"
        />
      </div>
      <div className="fixed sm:bottom-3vh w-full z-0">
        <div className="flex justify-center">
          <button className="text-center w-64 h-12 bg-button.red rounded-2xl retinaButtonLarge" onClick={() => handleDisplay(11)}>
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Send Message
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact