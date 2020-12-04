import React, { useState } from "react"
import Navbar from '../navbar'
import FourZeroFourPic from "../../images/red-404-esatta.svg"
import { Link } from "gatsby"

const FourZeroFour = () => {
  const [removeBtns, setRemoveBtns] = useState(false)
  return (
    <div>
      <Navbar setRemoveBtns={setRemoveBtns} text="" url="/home/sign-in" />
      <div className={`${removeBtns ? 'hidden' : 'block'} sm:pt-16`}>
        <img alt="hair" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={FourZeroFourPic} />
        <h1 className="mx-8 text-center text-4xl font-Georgia font-bold">
          OOOPS!
        </h1>
        <p className="mx-12 mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
          Something has gone wrong, this has been automatically reported. We are sorry for the inconvenience.
        </p>

        <Link className="absolute bottom-3vh w-full z-0" to="/home/profile">
          <div className="flex justify-center">
            <button className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge">
              <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
                Go to Profile
              </span>
            </button>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default FourZeroFour
