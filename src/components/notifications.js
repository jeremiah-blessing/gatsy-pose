import React, { useState } from 'react'
import '../css/slider.css'

const Notifications = () => {
  const [newRetailer, setNewRetailer] = useState(false)
  const [specOffers, setSpecOffers] = useState(false)
  const [outOfDate, setOutOfDate] = useState(false)

  return (
    <div className="m-4">
      <p className="w-full text-center font-Georgia font-bold text-4xl my-4">
        Notifications
      </p>
      <p className="my-6 mx-2 font-bold">
        Select which notifications to recieve:
      </p>

      <div className="flex mx-2 my-4">
        <p className="w-4/5">
          New Retailers:
        </p>
        <div className="w-1/5 flex justify-center">
          <label className="switch">
            <input type="checkbox" onChange={() => setNewRetailer(!newRetailer)} checked={newRetailer} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="flex mx-2 my-4">
        <p className="w-4/5">
          Special Offers:
        </p>
        <div className="w-1/5 flex justify-center">
          <label className="switch">
            <input type="checkbox" onChange={() => setSpecOffers(!specOffers)} checked={specOffers} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="flex mx-2 my-4">
        <p className="w-4/5">
          Measurements Out of Date:
        </p>
        <div className="w-1/5 flex justify-center">
          <label className="switch">
            <input type="checkbox" onChange={() => setOutOfDate(!outOfDate)} checked={outOfDate} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Notifications
