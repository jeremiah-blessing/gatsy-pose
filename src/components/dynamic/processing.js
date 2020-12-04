import React from "react"
import StepsBar from "../stepsBar"
import RedWaiting from "../../images/red-waiting-esatta.svg"
import { Link } from "gatsby"

const Processing = () => {
  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar
        stepNumber={8.0}
        prevPage="/home/step-seven"
        displayText="Processing"
      />
      <img alt="hair" className="w-4/5 px-4 my-2 sm:my-4 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={RedWaiting} />
      <h1 className="mx-10 text-center text-3xl sm:text-4xl font-Georgia font-bold">
        Processing..
      </h1>
      <div className="mx-12 mt-2 sm:mt-4 lg:mb-10 md:text-center text-xs sm:text-sm lg:text-base font-Roboto text-xs leading-relaxed tracking-widest">
        <p className="pb-2 sm:pb-6">
          Our system will take 3-5 minutes to callibrate your 3D Esatta Fit model. You will be automatically redirected to the Fit Dashboard when your model is ready.
        </p>
        <p>
          Browse our brands, you will be notified when your model is ready.
          </p>
      </div>

      <Link className="absolute bottom-5vh w-full z-0" to="/home/browse-brands">
        <div className="flex justify-center">
          <button className="text-center w-64 h-12 bg-button.red rounded-2xl retinaButtonLarge">
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Browse our brands
            </span>
          </button>
        </div>
      </Link>
    </div>
  )
}

export default Processing
