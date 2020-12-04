import React, { useState } from 'react'
import { connect } from 'react-redux'
import Navbar from '../navbar'
import { addBrand } from '../../store/thunk'
import HMIcon from '../../images/H-&-M.svg'
import CloseIconSvg from '../../images/x-svg.svg'

const BRANDS = [
  {
    value: 'H&M',
    img: HMIcon
  },
  {
    value: 'Zara',
    img: HMIcon
  },
  {
    value: 'H&M1',
    img: HMIcon
  },
  {
    value: 'H&M2',
    img: HMIcon
  },
  {
    value: 'H&M3',
    img: HMIcon
  },
  {
    value: 'H&M4',
    img: HMIcon
  },
  {
    value: 'H&M5',
    img: HMIcon
  },
  {
    value: 'H&M7',
    img: HMIcon
  },
  {
    value: 'H&M8',
    img: HMIcon
  },
  {
    value: 'H&M9',
    img: HMIcon
  },
  {
    value: 'H&M10',
    img: HMIcon
  },
  {
    value: 'H&M11',
    img: HMIcon
  },
  {
    value: 'H&M12',
    img: HMIcon
  },
  {
    value: 'H&M13',
    img: HMIcon
  },
  {
    value: 'H&M14',
    img: HMIcon
  },
  {
    value: 'H&M15',
    img: HMIcon
  },
  {
    value: 'H&M16',
    img: HMIcon
  },
  {
    value: 'H&M17',
    img: HMIcon
  },
  {
    value: 'H&M18',
    img: HMIcon
  },
  {
    value: 'H&M19',
    img: HMIcon
  },
  {
    value: 'H&M20',
    img: HMIcon
  },
  {
    value: 'H&M21',
    img: HMIcon
  },
  {
    value: 'H&M22',
    img: HMIcon
  },
  {
    value: 'H&M23',
    img: HMIcon
  }
]

const BrowseBrands = ({ user, onAddBrand, navigate }) => {
  const [removeBtns, setRemoveBtns] = useState(false)
  const [showPopup, setShowPopup] = useState('hidden')
  const [selectedBrand, setSelectedBrand] = useState('')

  const handleSelection = (brand) => {
    setShowPopup('block')
    setSelectedBrand(brand)

  }
  const showBrands = () => {
    return BRANDS.map(brand => {
      return (
        <img
          className=" h-11vh bg-white rounded-full"
          alt={brand.value}
          src={brand.img}
          key={brand.value}
          onClick={() => handleSelection(brand.value)}
        />
      )
    })
  }

  const getPopup = () => {
    if (user.isSignedIn) {
      return (
        <div>
          <p className="text-white mx-10% mt-1vh">
            Do you want to authorize {selectedBrand} to fetch your data
          </p>
        </div>
      )
    } else {
      return (
        <div>
          <p className="text-white mx-10% mt-2vh">
            Please sign in to authorize brands.
          </p>
        </div>
      )
    }
  }

  const handleAuthorize = () => {
    onAddBrand({ token: user.token, brand: selectedBrand, navigate })
    setShowPopup('hidden')
  }
  return (
    <div className="relative mt-12 sm:mt-20">
      <Navbar makeFixed="fixed w-full top-0" setRemoveBtns={setRemoveBtns} text="Home" url="/home/" />
      <div className={`${removeBtns ? 'hidden' : 'block'}`}>
        <h1 className="font-Georgia font-bold text-3xl text-center">
          Browse your brands
        </h1>
        <div className="grid grid-flow-row grid-cols-3 gap-4 mx-2 md:mx-6">
          {showBrands()}
        </div>
      </div>
      <div className={`absolute top-25vh w-full text-center z-20 ${showPopup}`}>
        <div className="w-8/12 bg-popup.blue top-25vh h-33vh m-auto rounded-lg border-4 border-popup.red.border">
          <img
            className="h-10 w-6 ml-auto mr-4"
            alt="close-icon"
            src={CloseIconSvg}
            onClick={() => setShowPopup('hidden')}
          />
          {getPopup()}
          <button
            className="h-16 bg-white rounded-full w-9/12 font-Roboto text-lg mt-8"
            onClick={() => handleAuthorize()}
          >
            Authorize
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  onAddBrand: (data) => dispatch(addBrand(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BrowseBrands)