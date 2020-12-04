import React from "react"
import { connect } from 'react-redux'
import StepsBar from "../stepsBar"
import AudioPlayer from '../audioPlayer'
import RedPicTaking from "../../images/red-picture-taking-esatta.svg"
import { Link } from "gatsby"

const StepSeven = ({user}) => {
  const aloneText = () => {
    return (
      <p>
        Place your device on a shelf or table around 2m (6ft) from the background.
        Ensure that it is around your head or chest height with the screen facing the
        background. Lean the device so that <b>it</b> angles towards you. In the next step ensure
        that your whole body is visible on the screen.
      </p>
    )
  }
  const friendText = () => {
    return (
      <p>
        Pass your device to the photographer. Face each other about 2m (6ft) apart,
        and hold the camera so that it is at the head or chest height of the person
        being photographed. In the next step ensure that the whole body is visible on the screen.
      </p>
    )
  }

  const changingText = () => user.cameraFace === 'user' ? aloneText() : friendText()
  const buttonText = () => user.cameraFace === 'user' ? 'My Device is Ready' : 'Start the Scan'

  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar
        stepNumber={8.0}
        prevPage="/home/step-six"
        displayText="Step 7/7"
      />
      <h1 className="mx-4 md:mt-4 text-center text-xl sm:text-3xl font-Georgia font-bold">
        Position Your Device
      </h1>
      <img alt="hair" className="w-3/5 px-4 mt-4 md:my-20 lg:my-20 mx-auto lg:retinaImageLarge" src={RedPicTaking} />
      <p className="mx-8 my:1 sm:mt-8 lg:mb-10 text-xs sm:text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        {changingText()}
      </p>

      <Link className="absolute bottom-3vh w-full z-0" to="/home/capture-front-pic">
        <div className="flex justify-center">
          <button className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge">
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              {buttonText()}
            </span>
          </button>
        </div>
      </Link>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps)(StepSeven)