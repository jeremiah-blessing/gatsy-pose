import React from 'react'
import Previous from '../images/previous.png'
import { Link } from 'gatsby'

const StepsBar = ({ stepNumber, prevPage, displayText  }) => {
  return (
    <div className="shadow-lg z-10 w-full bg-white fixed top-0 flex justify-between h-12">
      <Link to={`${prevPage}`} className="h-3 w-12 mt-5 md:mt-6 pl-6">
        <img alt="Esatta Logo" src={Previous} />
      </Link>
      <div className="mt-3 h-4 w-1/4">
        <p className="text-xs font-Futura text-center h-3">
          {displayText}
      </p>
        <hr className="mt-2" />
        <hr className={`border-progress w-${stepNumber}/7 mt-1px`} />
      </div>
      <div className="opacity-0 w-12" />
    </div>
  )
}

export default StepsBar