import React from "react"
import { connect } from 'react-redux'
import StepsBar from "../stepsBar"
import RedMale from "../../images/red-male-esatta.svg"
import { Link } from "gatsby"

const StepSix = ({ user }) => {
  const changingText = () => user.cameraFace === 'user' ? 'ALONE' : 'FRIEND'
  return (
    <div className="h-screen pt-15vh relative">
      <StepsBar stepNumber={6.0} prevPage="/home/step-five" displayText="Step 6/8" />
      <img alt="hair" className="h-33vh w-20.8% m-auto" src={RedMale} />
      <p className="text-center text-190% font-Georgia font-bold my-2vh">
        Standing Positions
      </p>
      <p className="mx-6% mb-2vh text-center font-Roboto text-13px tracking-1.6 leading-3vh">
        <strong>Prototype:</strong>
        <br />
        This step is meant to contain photos based on gender the “Dos/Donts” on
        how a customers should stand.
        <br/>
        {changingText()}
      </p>

      <p className="mx-6% font-Roboto text-13px leading-3vh text-center tracking-1.6">
        Review standing position ilustrations above, press next to choose a
        guide.
      </p>

      <Link className="absolute sm:bottom-3vh w-full" to="/home/step-seven">
        <div className="flex justify-center mt-5vh mb-3vh">
          <button className="text-center w-64.8% bg-enabled.btn rounded-20px h-54px">
            <span className="text-white text-20px font-Futura font-medium">
              Next
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

export default connect(mapStateToProps)(StepSix)