import React from "react"
import { connect } from 'react-redux'
import { setVoicePref } from '../../store/thunk'
import StepsBar from "../stepsBar"
import RedVoice from "../../images/red-voice-esatta.svg"
import { Link } from "gatsby"

const StepSix = ({ user, onVoiceSelection, navigate }) => {
  const handleClick = () => {
    onVoiceSelection(true)
    navigate('/home/step-seven')
  }

  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar stepNumber={6.0} prevPage="/home/step-five" displayText="Step 6/7" />
      <h1 className="mx-8 md:mt-8 text-center text-2xl sm:text-3xl font-Georgia font-bold">
        Choose your Guide
      </h1>
      <img alt="hair" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={RedVoice} />

      <p className="mx-12 my:1 sm:mt-4 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        To help guide you to the correct position we would like to use voice instructions. The better the pose the more accurate your results will be.
      </p>

      <div className="absolute w-full bottom-1vh">
        <div className="absolute bottom-3vh w-full z-0">
          <div className="flex justify-center">
            <button
              className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge"
              onClick={() => handleClick()}
            >
              <span className="text-white text-xl font-Futura font-medium">
                Enable Voice Instructions
              </span>
            </button>
          </div>
        </div>
        <Link to="/home/step-seven">
          <p className="text-center text-sm font-Georgia underline">
            Continue without voice instructions
          </p>
        </Link>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  onVoiceSelection: (preference) => dispatch(setVoicePref(preference)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StepSix)
