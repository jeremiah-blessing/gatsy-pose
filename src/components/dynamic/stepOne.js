import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import StepsBar from '../stepsBar'
import Terms from '../terms'
import Privacy from '../privacy'
import { setMeasureDetails } from '../../store/thunk'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'

import CloseIcon from '../../images/close-icon.png'
import CheckedCheckbox from '../../images/checkboxChecked.png'
import UncheckedCheckbox from '../../images/checkboxUnchecked.png'
import { combineReducers } from 'redux'

const StepOne = ({ onContinuePressed, navigate, measure }) => {
  const [gender, setGender] = useState(measure.gender)
  const [genderValidation, setGenderValidation] = useState('')

  const [heightMetric, setHeightMetric] = useState(measure.heightMetric)
  const [heightImperial, setHeightImperial] = useState(measure.heightImperial)
  const [heightUnit, setHeightUnit] = useState(measure.heightUnit)
  const [heightBorder, setHeightBorder] = useState('border-b border-input.border')

  const [weightMetric, setWeightMetric] = useState(measure.weightMetric)
  const [weightImperial, setWeightImperial] = useState(measure.weightImperial)
  const [weightUnit, setWeightUnit] = useState(measure.weightUnit)
  const [weightBorder, setWeightBorder] = useState('border-b border-input.border')

  const [age, setAge] = useState(measure.age ||'25')
  const [ageBorder, setAgeBorder] = useState('')

  const [dateOfBirth, setDateOfBirth] = useState(measure.dateOfBirth ||'')

  const [terms, setTerms] = useState(false)
  const [alert, setAlert] = useState('opacity-0 mt-5')
  const [errorMsg, setErrorMsg] = useState('')

  const [showPolicies, setShowPolicies] = useState('hidden')
  const [showPolicy, setShowPolicy] = useState('terms')

  const AGE_ERROR = 'Unfortunately, as per our Terms of Use, we are only able to provide these services if you are 16 and over.'
  const INCOMPLETE_ERROR = 'Please read and accept our Terms of Use and Privacy Notice'
  const RE_SCAN_TEXT = 'Please check that your general information is correct as it\nwill impact the accuracy of your results'

  useEffect(() => {
    if (typeof window !== 'undefined' && alert === 'opacity-0 mt-5') {
      const search = window.location.search
      const params = search && new URLSearchParams(search)
      if (params && params.get('alert')) {
        setErrorMsg(RE_SCAN_TEXT)
        setAlert('opacity-100 h-5 bg-alert.green')
      }
    }
  })

  const calculate_age = (dob1) => {
    var today = new Date();
    var birthDate = new Date(dob1);  // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age_now--;
    }
    setDateOfBirth(dob1)
    setAge(age_now)
    return age_now;
  }

  const showPrivacy = () => {
    setShowPolicy('privacy')
    setShowPolicies('block')
  }

  const showTerms = () => {
    setShowPolicy('terms')
    setShowPolicies('block')
  }

  const handleMetricHeight = (value) => {
    const totalInches = value / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = (totalInches - (12 * feet )).toFixed(1)
    setHeightMetric(value)
    setHeightImperial({ feet, inches })
  }

  const handleFeet = (value) => {
    const metricHeight = ((value * 30.48) + (heightImperial.inches * 2.54)).toFixed(1)
    setHeightImperial((height) => {
      return {
        feet: value,
        inches: height.inches
      }
    })
    setHeightMetric(metricHeight)
  }

  const handleInches = (value) => {
    const metricHeight = ((heightImperial.feet * 30.48) + (value * 2.54)).toFixed(1)
    setHeightImperial((height) => {
      return {
        feet: height.feet,
        inches: value
      }
    })
    setHeightMetric(metricHeight)
  }

  const handleKilogram = (value) => {
    const pounds = (value * 2.205).toFixed(1)
    setWeightImperial(pounds)
    setWeightMetric(value)
  }

  const handlePounds = (value) => {
    const kilos = (value / 2.205).toFixed(1)
    setWeightImperial(value)
    setWeightMetric(kilos)
  }

  const details = () => ({
    gender,
    heightMetric,
    heightImperial,
    heightUnit,
    age: parseInt(age),
    weightMetric,
    weightImperial,
    weightUnit,
    unit: heightUnit === 'Metric' ? true : false
  })

  const nextPage = async () => {
    if (age < 16) {
      setHeightBorder('border-b border-input.border')
      setWeightBorder('border-b border-input.border')
      setAgeBorder('border-b border-input.border')
      setGenderValidation('')
      setErrorMsg(AGE_ERROR)
      setAlert('opacity-100 h-10 bg-alert.red')
    } else {
      onContinuePressed(details())
      await navigate('/home/step-two')
    }
  }

  const displayError = () => {
    if (!terms) {
      setErrorMsg(INCOMPLETE_ERROR)
      setAlert('opacity-100 h-5 bg-alert.red')
    }
    heightMetric ? setHeightBorder('border-b border-input.border') : setHeightBorder('border-2 border-solid border-red-600')
    weightMetric ? setWeightBorder('border-b border-input.border') : setWeightBorder('border-2 border-solid border-red-600')
    age ? setAgeBorder('border-b border-input.border') : setAgeBorder('border-2 border-solid border-red-600')
    gender !== null ? setGenderValidation('') : setGenderValidation('Please select a gender')
  }

  const isInfoFilled = () => (gender !== undefined) && heightMetric && weightMetric && age && terms

  const getCheckboxImage = () => terms ? CheckedCheckbox : UncheckedCheckbox

  return (
    <div className="relative h-screen pt-16 font-Georgia z-0">
      <StepsBar stepNumber={1.0} prevPage="/home/" displayText="Step 1/7" />
      <div className={`text-white text-center text-xs px-8 ${alert}`}>
        {errorMsg}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center md:mt-16">
        General Information
      </h1>

      <div className={`h-screen w-full absolute top-0 bg-white z-10 ${showPolicies}`}>
        <div className="inline-flex mb-8">
          <img
            className="absolute w-10 top-0 right-0 mr-4 lg:mr-8 mt-2"
            alt="close-icon"
            src={CloseIcon}
            onClick={() => setShowPolicies('hidden')}
          />
        </div>
        {showPolicy === 'terms' ? <Terms /> : <Privacy />}
      </div>

      <div className="md:m-auto md:w-6/12">

        {/* GENDER */}
        <div className="mt-6 ml-8 md:mt-10">
          <h2 className="text-xl font-bold">
            Gender
          </h2>
          <p className="text-red-700 text-sm mb-4">
            {genderValidation}
          </p>
          <div className="h-5 relative mb-3">
            <label>
              <input
                className="h-5"
                type="radio"
                name="gender"
                defaultChecked={gender === 0}
                onClick={() => setGender(0)}
              />
              <p className="inline-block leading-5 absolute pl-2 text-xl">
                Female
                </p>
            </label>
          </div>
          <div className="h-5 relative mb-6">
            <label>
              <input
                className="h-5"
                type="radio"
                name="gender"
                defaultChecked={gender === 1}
                onClick={() => setGender(1)}
              />
              <p className="inline-block leading-5 absolute pl-2 text-xl">
                Male
                </p>
            </label>
          </div>
        </div>

        {/* HEIGHT */}
        <div className="flex mt-10 m-8 md:mt-12">
          <div className="w-7/12">
            <h2 className="text-xl font-bold">
              Height
            </h2>
            <input
              className={`${heightUnit === 'Imperial' ? 'hidden' : 'block'} ${heightBorder} w-4/5 bg-input.bg h-8 pl-2 focus:outline-none inline-block`}
              type="number"
              name="height"
              onChange={(e) => handleMetricHeight(parseInt(e.target.value))}
              value={heightMetric}
              placeholder='e.g. 180'
            />
            <input
              className={`${heightUnit === 'Metric' ? 'hidden' : 'w-35%'} ${heightBorder} bg-input.bg h-8 pl-2 focus:outline-none inline-block`}
              type="number"
              name="feet"
              onChange={(e) => handleFeet(parseInt(e.target.value))}
              value={heightImperial.feet}
              placeholder='e.g. 5'
            />
            <input
              className={`${heightUnit === 'Metric' ? 'hidden' : 'block'} ${heightBorder} w-35% inline-block ml-10% bg-input.bg h-8 pl-2 focus:outline-none`}
              type="number"
              name="inches"
              onChange={(e) => handleInches(parseInt(e.target.value))}
              value={heightImperial.inches}
              placeholder='e.g. 7'
            />
          </div>
          <div className="mt-5 md:ml-12">
            <div className="h-5 relative mb-3">
              <label>
                <input type="radio" name="height" defaultChecked={heightUnit === 'Metric'} onClick={() => setHeightUnit('Metric')} />
                <p className="inline-block leading-5 absolute pl-2 text-xl">
                  cm
                </p>
              </label>
            </div>
            <div className="h-5 relative mb-3">
              <label>
                <input type="radio" name="height" defaultChecked={heightUnit === 'Imperial'} onClick={() => setHeightUnit('Imperial')} />
                <p className="inline-block leading-5 absolute pl-2 text-xl">
                  ft/in
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* WEIGHT */}
        <div className="flex mt-6 m-8 md:mt-10">
          <div className="w-7/12">
            <h2 className="text-xl font-bold mb-1">
              Weight
            </h2>
            <input
              className={`${weightUnit === 'Imperial' ? 'hidden' : 'block'} w-4/5 bg-input.bg h-8 pl-2 focus:outline-none ${weightBorder}`}
              type="number"
              name="weightMetric"
              onChange={(e) => handleKilogram(parseInt(e.target.value))}
              value={weightMetric}
              placeholder='e.g. 80'
            />
            <input
              className={`${weightUnit === 'Metric' ? 'hidden' : 'block'} w-4/5 bg-input.bg h-8 pl-2 focus:outline-none ${weightBorder}`}
              type="number"
              name="weightImperial"
              onChange={(e) => handlePounds(parseInt(e.target.value))}
              value={weightImperial}
              placeholder='e.g. 140'
            />
          </div>
          <div className="mt-5 md:ml-12">
            <div className="h-5 relative mb-3">
              <label>
                <input type="radio" name="weight" defaultChecked={weightUnit === 'Metric'} onClick={() => setWeightUnit('Metric')} />
                <p className="inline-block leading-5 absolute pl-2 text-xl">
                  kg
                </p>
              </label>
            </div>
            <div className="h-5 relative mb-3">
              <label>
                <input type="radio" name="weight" defaultChecked={weightUnit === 'Imperial'} onClick={() => setWeightUnit('Imperial')} />
                <p className="inline-block leading-5 absolute pl-2 text-xl">
                  lbs
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Age */}
        <div className="mt-6 m-8 md:mt-10">
          <h2 className="text-xl font-bold mb-1">
            Date of Birth
          </h2>
          <div className="w-7/12">
            <DatePicker 
              dateFormat="dd-MM-yyyy"
              className="bg-input.bg w-5/6 h-8 pl-2 focus:outline-none inline-block border-b border-input.border"
              selected={dateOfBirth || null}
              onChange={(e) => calculate_age(e)}
              disabledKeyboardNavigation
              placeholderText="e.g. 17/01/1994"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 md:mt-20">
        {/* TERMS AND CONDITIONS */}
        <div className="text-center">
          <img className="w-5 h-5 inline mr-4" src={getCheckboxImage()} onClick={() => setTerms(!terms)} />

          <p className="inline text-base">
            Agree to <button onClick={() => showTerms()}><u>Terms of Use</u></button> and our
          <br /><button onClick={() => showPrivacy()}><u>Privacy Notice</u></button>
          </p>
        </div>
        {/* CONTINUE BUTTON */}
        <div className="absolute mt-4 md:bottom-3vh w-full z-0" to="/home/step-three">
          <div className="flex justify-center">
            <button
              className={`text-center w-64 bg-${isInfoFilled() ? 'enabled.btn' : 'disabled.btn'} rounded-2xl h-12 retinaButtonLarge focus:outline-none`}
              onClick={() => isInfoFilled() ? nextPage() : displayError()}
            >
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Continue
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  measure: state.measure
})

const mapDispatchToProps = dispatch => ({
  onContinuePressed: (details) => dispatch(setMeasureDetails(details)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StepOne)
