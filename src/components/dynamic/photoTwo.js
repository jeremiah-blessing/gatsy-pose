import React from "react"
import { connect } from 'react-redux'
import StepsBar from "../stepsBar"
import RedFirstCheck from "../../images/red-first-check-esatta.svg"
import { Link } from "gatsby"
import { sendDataToBackend } from '../../store/thunk'

const PhotoTwo = ({ processData, measure, user, navigate }) => {
  processData({ ...measure, token:user.token })
  // if (user.isSignedIn) navigate('/home/processing')

  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar
        stepNumber={8.0}
        prevPage="/home/photo-one"
        displayText="Photo 2/2"
      />
      <img alt="hair" className="w-3/5 px-4 my-2 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={RedFirstCheck} />
      <h1 className="mx-6 sm:mx-8 text-center text-2xl sm:text-4xl font-Georgia font-bold">
        Picture perfect!
      </h1>
      <div className="mx-10 lg:mx-32 sm:mx-12 sm:mt-4 lg:mb-10 md:text-center text-xs sm:text-sm lg:text-base font-Roboto text-xs leading-relaxed tracking-widest">
        <p className="pb-3">
          Our system will take 3-5 minutes to callibrate your 3D Esatta Fit model.
        </p>
        <p>
          Why not create an account whilst your 3D Fit is being created. Your 3D Fit will be saved to your account automatically.
        </p>
      </div>

      <div className="absolute w-full bottom-1vh">
        <Link to="/home/sign-up">
          <div className="absolute bottom-3vh w-full z-0">
            <div className="flex justify-center">
              <button className="text-center w-64 h-12 bg-button.red rounded-2xl retinaButtonLarge">
                <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                  Create an Account
                </span>
              </button>
            </div>
          </div>
        </Link>
        <div className="text-center">
          <Link to="/home/processing">
            <p className="text-center text-sm font-Georgia underline">
              Continue without creating an account
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  measure: state.measure,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  processData: (data) => dispatch(sendDataToBackend(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotoTwo)
