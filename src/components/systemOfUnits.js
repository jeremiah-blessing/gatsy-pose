import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setSystemOfUnits } from '../store/thunk'
import RedWall from '../images/red-help-esatta.svg'

const SystemOfUnitsPage = ({ measure, onSelect }) => {

  return (
    <div>
      <p className="w-full text-center font-Georgia font-bold text-4xl mt-8 mb-4">
        System of Units
      </p>
      <img alt="help" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={RedWall} />

      <div className="mx-8 mt-10">

        <p className="text-center">
          Current preferred system is: <span className="font-bold text-esatta.red">{measure.metric ? 'Metric' : 'Imperial'}</span>
        </p>
        <p className="my-4">
          Please select your preferred system from below:
        </p>
        <button
          className="w-full focus:outline-none"
          onClick={() => onSelect({system:'Metric', metric: true})}
        >
          <p className="py-1 font-Roboto text-sm leading-6 tracking-1.6 text-left">
            Metric
          </p>
          <hr />
        </button>
        <button
          className="w-full focus:outline-none"
          onClick={() => onSelect({ system: 'Imperial', metric: false })}
        >
          <p className="py-1 font-Roboto text-sm leading-6 tracking-1.6 text-left">
            Imperial
          </p>
          <hr />
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  measure: state.measure
})

const mapDispatchToProps = dispatch => ({
  onSelect: (details) => dispatch(setSystemOfUnits(details)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SystemOfUnitsPage)
