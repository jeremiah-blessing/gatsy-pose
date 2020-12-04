import React from 'react'
import { connect } from 'react-redux'
import StepsBar from '../stepsBar'
import RedSkinTight from '../../images/red-skin-tight.svg'
import BlueSkinTight from '../../images/blue-skin-tight.svg'
import { Link } from 'gatsby'

const StepTwo = ({ measure }) => {
  const genderedImage = () => measure.gender === 0 ? RedSkinTight : BlueSkinTight

  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar stepNumber={2.0} prevPage="/home/step-one" displayText="Step 2/7"/>
      <img alt="Skin Tight" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={genderedImage()} />
      <h1 className="mx-8 text-center text-3xl sm:text-4xl font-Georgia font-bold">
        Skin tight clothing
      </h1>
      <p className="mx-8 mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        The better defined your body outline, the more accurate your results.
      </p>

      <Link className="absolute bottom-3vh w-full z-0" to="/home/step-three">
        <div className="flex justify-center">
          <button className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge">
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              I’m in skin tights
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

export default connect(mapStateToProps)(StepTwo)
