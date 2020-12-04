import React, { useState } from 'react'
import { connect } from 'react-redux'
import StepsBar from '../stepsBar'
import { setCameraFace } from '../../store/thunk'

const StepFive = ({ navigate, onReadyPressed }) => {
  const [cameraFace, setCameraFace] = useState(undefined)
  const [alert, setAlert] = useState("opacity-0")

  const handleReady = async () => {
    onReadyPressed(cameraFace)
    await navigate('/home/step-six')
  }

  return (
    <div className="pt-16 h-screen">
      <StepsBar stepNumber={5.0} prevPage="/home/step-four" displayText="Step 5/7" />

      <div className={`${alert} h-10 bg-alert.red text-white text-center text-sm font-Roboto font-bold`}>
        <p className="pb-2 pt-3 sm:pt-2">Please select an option.</p>
      </div>

      <h1 className="font-Georgia font-bold text-3xl sm:text-4xl text-center mb-32 sm:mb-32 md:mb-64 lg:mb-64">
        Picture taking
      </h1>

      <div className="text-left w-2/5 sm:w-5/12 lg:w-1/6 sm:w-2/6 md:w-1/6 m-auto font-Georgia font-normal text-base">
        <div className="h-5 relative mb-6">
          <input
            className="h-5 mr-2"
            id="Alone"
            type="radio"
            name="pic"
            onClick={() => setCameraFace('user')}
          />
          <label for="Alone">
            <p className="inline-block leading-5 absolute">
              Alone
            </p>
          </label>
        </div>
        <div className="h-5 relative mb-6">
          <input
            className="h-5 mr-2"
            id="WithFriend"
            type="radio"
            name="pic"
            onClick={() => setCameraFace('environment')}
          />
          <label for="WithFriend">
            <p className="inline-block leading-5 absolute">
              With a friend
            </p>
          </label>
        </div>
      </div>

      <div className="absolute bottom-3vh w-full z-0">
        <div className="flex justify-center">
          <button
            className={`text-center w-64 h-12 bg-${cameraFace ? 'enabled.btn' : 'disabled.btn'} rounded-2xl retinaButtonLarge`}
            onClick={async () => cameraFace ? await handleReady() : setAlert("opacity-100")}
          >
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  onReadyPressed: (direction) => dispatch(setCameraFace(direction)),
})

export default connect(null, mapDispatchToProps)(StepFive)
