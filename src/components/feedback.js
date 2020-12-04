import React, { useState } from 'react'
import RedFeedback from '../images/red-feedback-esatta.svg'

const Feedback = ({ handleDisplay }) => {
  const [feedbackType, setFeedbackType] = useState('')
  const [feedback, setFeedback] = useState('')
  const handleContactChange = (e) => setFeedbackType(e.target.value)
  const handleFeedbackChange = (e) => setFeedback(e.target.value)

  return (
    <div className="bg-white z-30">
      <p className="w-full text-center font-Georgia font-bold text-4xl sm:my-4">
        Feedback
      </p>
      <img className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" alt="contact-us" src={RedFeedback} />
      <div className="text-center">
        <select
          name="feedback-type"
          className="w-4/5 border h-10 rounded-lg mb-2 sm:mb-4 pl-4 focus:outline-none"
          onBlur={handleContactChange}
        >
          <option value="">Select feedback type...</option>
          <option value="feedback-1">Feedback 1</option>
          <option value="feedback-2">Feedback 2</option>
          <option value="feedback-3">Feedback 3</option>
        </select>
        <textarea
          placeholder="Type your feedback here..."
          value={feedback}
          onChange={handleFeedbackChange}
          className="w-4/5 border h-32 sm:h-48 p-4 rounded-lg"
        />
      </div>
        <div className="fixed sm:bottom-3vh w-full z-0h">
          <div className="flex justify-center">
            <button className="text-center w-64 h-12 bg-button.red rounded-2xl retinaButtonLarge" onClick={() => handleDisplay(10)}>
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Send Feedback
              </span>
            </button>
          </div>
        </div>
    </div>
  )
}

export default Feedback