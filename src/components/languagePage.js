import React, { useState } from 'react'
import RedWall from '../images/red-help-esatta.svg'

const LANGUAGES = [
  'Arabic',
  'English',
  'French',
  'German',
  'German',
  'German',
  'German',
  'German',
  'German',
  'German',
  'German',
  'German',
  'German'
]

const LanguagePage = () => {
  const [defaultLang, setDefaultLanguage] = useState('English')

  const diplayMenu = () => {
    return LANGUAGES.map(item => {
      return (
        <button
          className="w-full focus:outline-none"
          key={item}
          onClick={() => setDefaultLanguage(item)}
        >
          <p className="py-2 font-Roboto text-xs leading-6 tracking-1.6 text-left">
            {item}
          </p>
          <hr />
        </button>
      )
    })
  }

  const menu = diplayMenu()
  return (
    <div>
      <p className="w-full text-center font-Georgia font-bold text-4xl sm:my-4">
        Language
      </p>
      <img alt="help" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={RedWall} />

      <div className="mx-8 mt-10">

        <p className="text-center">
          Your current language is: <span className="font-bold text-esatta.red">{defaultLang}</span>
        </p>
        <p className="my-4">
          Please select a language from below:
        </p>
        {menu}
      </div>
    </div>
  )
}

export default LanguagePage
