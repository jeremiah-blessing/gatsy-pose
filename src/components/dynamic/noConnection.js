import React from "react"
import NoConnectionPic from "../../images/red-no-connection-esatta.svg"
import { Link } from "gatsby"

const NoConnection = () => {
  return (
    <div className="relative h-screen sm:pt-16 font-Georgia z-0">
      <img alt="hair" className="w-4/5 px-4 my-4 sm:my-8 md:my-20 lg:my-20 mx-auto retinaImageLarge" src={NoConnectionPic} />
      <h1 className="mx-8 text-center text-3xl font-Georgia font-bold">
        Unable to Connect
      </h1>
      <p className="mx-12 mt-2 lg:mb-10 text-sm lg:text-base text-center font-Roboto text-xs leading-relaxed tracking-widest">
        Please ensure you have WiFi or mobile data enabled.
      </p>

      <Link className="absolute lg:relative bottom-5vh sm:bottom-3vh w-full z-0" to="/home/profile">
        <div className="flex justify-center">
          <button className="text-center w-64 h-12 bg-enabled.btn rounded-2xl retinaButtonLarge">
            <span className="text-white text-xl lg:text-2xl font-Futura font-medium">
              Refresh
            </span>
          </button>
        </div>
      </Link>
    </div>
  )
}

export default NoConnection
