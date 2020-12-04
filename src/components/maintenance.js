import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/header'
import MaintenanceImg from '../../src/images/red-maintenance-esatta.svg'

const Maintenance = ({ navigate }) => {
  return (
    <div>
      <Header />
      <img
        alt="Selfie"
        className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge"
        src={MaintenanceImg}
      />
      <p className="mx-8 text-center text-4xl font-Georgia font-bold">
        Maintenance
      </p>
      <p className="mx-12 mt-2 lg:mb-10 text-sm lg:text-base md:text-center font-Roboto text-xs leading-relaxed tracking-widest">
        We are constantly improving our Esatta Fit system. Sometimes we require to take down our services for major updates.
        <br/>
        <br/>
        <br/>
        <strong>ETA: </strong>2:00am AEST, 29/03/2020
      </p>
      <div className="absolute sm:bottom-3vh w-full z-0">
        <div className="flex justify-center">
          <button
            className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge"
            onClick={async () => await navigate('/home/browse-brands')}
          >
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Browse all stores
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps)(Maintenance)
