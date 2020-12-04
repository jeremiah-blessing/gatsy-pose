import React from 'react'
import { connect } from 'react-redux'
import StepsBar from '../stepsBar'
import RedSkinTight from '../../images/red-skin-tight.svg'
import BlueSkinTight from '../../images/blue-skin-tight.svg'
import { Link } from 'gatsby'

const StepThree = ({ measure }) => {
  const genderedImage = () => measure.gender === 0 ? RedSkinTight : BlueSkinTight

  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar stepNumber={3.0} prevPage="/home/step-two" displayText="Step 3/7"/>
      <img alt="hair" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={genderedImage()} />
      <h1 className="mx-8 text-center text-3xl sm:text-4xl font-Georgia font-bold">
        Hair
      </h1>
      <p className="mx-8 mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        Prototype:This step is meant to contain photos based on gender the “Dos/Donts” on how a customers hair should be styled.e.g tied into a bun..
      </p>

      <Link className="absolute bottom-3vh w-full z-0" to="/home/step-four">
        <div className="flex justify-center">
          <button className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge">
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Continue
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

export default connect(mapStateToProps)(StepThree)
