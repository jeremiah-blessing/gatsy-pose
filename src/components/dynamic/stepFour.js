import React from 'react'
import { connect } from 'react-redux'
import StepsBar from '../stepsBar'
import RedWall from '../../images/red-wall-esatta.svg'
import { Link } from 'gatsby'

const StepFour = ({ measure }) => {

  const METRIC_TEXT = '2m by 2m '
  const IMPERIAL_TEXT = '6ft by 6ft'

  const isCivilized = () => measure.metric ? METRIC_TEXT : IMPERIAL_TEXT

  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar stepNumber={4.0} prevPage="/home/step-three" displayText="Step 4/7" />
      <img alt="hair" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={RedWall} />
      <h1 className="mx-8 text-center text-3xl sm:text-4xl font-Georgia font-bold">
        Background
      </h1>
      <p className="mx-8 mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        Create a 2metre empty space on a wall. Wear clothes of a different color from your clear wall.
      </p>

      <Link className="absolute bottom-3vh w-full z-0" to="/home/step-five">
        <div className="flex justify-center">
          <button className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge">
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Background is clear
            </span>
          </button>
        </div>
      </Link>
    </div>
  )
}

const mapStateToProps = state => ({
  measure: state.measure,
})

export default connect(mapStateToProps)(StepFour)
