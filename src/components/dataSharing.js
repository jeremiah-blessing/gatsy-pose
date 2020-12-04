import React, { useState } from 'react'
import '../css/slider.css'

const DataSharing = () => {
  const [shareWithAll, setShareWithAll] = useState(false)

  const showProviders = () => {
    const providers = []
    for (let i = 1; i < 25; i++) {
      providers.push(
        <div key={i} className="flex mt-2">
          <p className="w-4/5 leading-8">
            Retailer {i}:
          </p>
          <div className="w-1/5 flex justify-center">
            <label className="switch">
              <input type="checkbox"/>
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      )
    }
    return providers
  }

  return (
    <div className="bg-white">
      <div className="bg-white z-20 top-6vh w-full">
        <p className="w-full text-center font-Georgia font-bold text-4xl mb-4">
          Data Sharing
        </p>
        <p className="mx-8 mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
          <b>Select where you would like to use your data to shop better :</b>
        </p>
        <div className="flex mx-4 my-6">
          <p className="w-4/5 leading-8">
            Share with all providers:
          </p>
          <div className="w-1/5 flex justify-center">
            <label className="switch">
              <input type="checkbox" onChange={() => setShareWithAll(!shareWithAll)} checked={shareWithAll}/>
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <hr className="border-esatta.red" />
      </div>
      <div className="m-4">
        {showProviders()}
      </div>
    </div>
  )
}

export default DataSharing
