import React from 'react'
import EsattaLogo from '../images/esatta-logo.svg'

const Header = () => {
  return (
    <div className="shadow-lg w-full bg-white flex justify-center h-12 md:h-16 px-4 z-0">
      <img alt="Esatta Logo" className="w-1/3 md:w-3/12" src={EsattaLogo} />
    </div>
  )
}

export default Header