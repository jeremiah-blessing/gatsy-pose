import React, { useEffect } from "react"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/lib/integration/react"
import { Provider } from "react-redux"
import { Router } from "@reach/router"
import { configureStore } from "../store"
// import "../css/tailwind.css"
// import "../css/tailwind.css"

import SignIn from "../components/dynamic/signIn.js"
import SignUp from "../components/dynamic/signUp"
import ForgotPassword from "../components/dynamic/forgotPassword"
import ResetPassword from "../components/dynamic/resetPassword"
import LandingPage from "../components/dynamic/landingPage"
import StepOne from "../components/dynamic/stepOne"
import StepTwo from "../components/dynamic/stepTwo"
import StepThree from "../components/dynamic/stepThree"
import StepFour from "../components/dynamic/stepFour"
import StepFive from "../components/dynamic/stepFive"
import StepSix from "../components/dynamic/stepSix"
import StepSeven from "../components/dynamic/stepSeven"
import PhotoOne from "../components/dynamic/photoOne"
import PhotoTwo from "../components/dynamic/photoTwo"
import Processing from "../components/dynamic/processing"
import Profile from "../components/dynamic/profile"
import BrowseBrands from "../components/dynamic/browseBrands"
import Maintenance from "../components/maintenance"
import FourZeroFour from "../components/dynamic/404"
import NoConnection from "../components/dynamic/noConnection"
import MaintenanceImg from "../images/red-maintenance-esatta.svg"

import CaptureFrontPic from "../components/captureFrontPic"
import CaptureSidePic from "../components/captureSidePic"

import CaptureFrontPicc from "../components/captureFrontPicc"
import CaptureSidePicc from "../components/captureSidePicc"

const store = configureStore()
const persistor = persistStore(store)

const HomePage = () => {
  function MobileAndTabletCheck() {
    if (typeof window !== "undefined") {
      if (typeof window.orientation !== "undefined") {
        console.log("true")
        return true
      } else {
        console.log("false")
        return false
      }
    } else {
      return true
    }
  }
  return (
    <div>
      <div id="popup">
        <div className={`${MobileAndTabletCheck() ? "block" : "hidden"}`}>
          <img
            alt="hair"
            className="w-1/3 px-4 my-4 md:my-20 lg:my-20 mx-auto retinaImageLarge"
            src={MaintenanceImg}
          />
          <h1 className="mx-8 text-center text-xl font-Georgia font-bold">
            Sorry, this app is only designed to be used in portrait mode
          </h1>
        </div>
        <div className={`${MobileAndTabletCheck() ? "hidden" : "block"}`}>
          <h1 className="mx-8 text-center text-xl font-Georgia font-bold">
            Please scan the QR code below to be redirected to the mobile app
          </h1>
        </div>
      </div>
      <div id="app">
        <Provider store={store}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <Router>
              <LandingPage path="/home/" />

              <SignIn path="/home/sign-in" />
              <SignUp path="/home/sign-up" />
              <ForgotPassword path="/home/forgot-password" />
              <ResetPassword path="/home/reset-password" />
              <Profile path="/home/profile" />
              <BrowseBrands path="/home/browse-brands" />
              <Maintenance path="/home/maintenance" />
              <FourZeroFour path="/home/404" />
              <NoConnection path="/home/no-connection" />

              <StepOne path="/home/step-one" />
              <StepTwo path="/home/step-two" />
              <StepThree path="/home/step-three" />
              <StepFour path="/home/step-four" />
              <StepFive path="/home/step-five" />
              <StepSix path="/home/step-six" />
              <StepSeven path="/home/step-seven" />

              <PhotoOne path="/home/photo-one" />
              <PhotoTwo path="/home/photo-two" />

              <CaptureFrontPic path="/home/capture-front-pic" />
              <CaptureSidePic path="/home/capture-side-pic" />

              <CaptureFrontPicc path="/home/capture-front-picc" />
              <CaptureSidePicc path="/home/capture-side-picc" />
              <Processing path="/home/processing" />
            </Router>
          </PersistGate>
        </Provider>
      </div>
    </div>
  )
}

export default HomePage
