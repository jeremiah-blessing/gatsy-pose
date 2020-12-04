import React from "react"
import { connect } from 'react-redux'
import StepsBar from "../stepsBar"
import RedFirstCheck from "../../images/red-first-check-esatta.svg"
import AudioPlayer from '../audioPlayer'
import { Link } from "gatsby"

const PhotoOne = ({user}) => {
  const displaySpeaker = () => { if (user.voice) return <AudioPlayer /> }
  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar
        stepNumber={4.0}
        prevPage="/home/step-seven"
        displayText="Photo 1/2"
      />
      {displaySpeaker()}
      <img alt="hair" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={RedFirstCheck} />
      <h1 className="mx-8 text-center text-4xl font-Georgia font-bold">
        Awesome!
      </h1>
      <p className="mx-12 sm:mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        To help guide you to the correct position we would like to use voice instructions. The better the pose the more accurate your results will be.
      </p>

      <Link className="absolute bottom-3vh w-full z-0" to="/home/capture-side-pic">
        <div className="flex justify-center">
          <button className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge">
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Next photo
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

export default connect(mapStateToProps)(PhotoOne)
