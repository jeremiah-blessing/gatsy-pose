import React, { useRef, useState } from "react"
import { connect } from 'react-redux'
import styled from 'styled-components'
import { blobToBase64 } from 'base64-blob'
import { startStream, takePhoto } from '../utils/camUtils'
import { saveSecondImage } from '../store/thunk'

import FadingText from './fadingSideText'
import AudioPlayer from './audioPlayer'
import CloseIconSvg from '../images/x-svg.svg'

// ONLY ADD THIS WHEN USING FRONT FACE CAM
const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`

const CapturePic = ({ navigate, user, onCapturePressed }) => {
  const [gravityVector, setGravityVector] = useState({ x: '', y: '', z: '' })
  const [xAxisOrientation, setXAxisOrientation] = useState(90)
  const [captureBtn, setCaptureBtn] = useState('hidden')
  const [prompt, setPrompt] = useState('')
  const videoRef = useRef();

  const getIndicatorPosition = () => {
    const indicator = `${100 - Math.floor((xAxisOrientation / 180) * 100)}`
    var top = `${50}%`

    if(indicator > 100){
      top = `${99}%`
    }
    else if(indicator < 0) {
      top = `${1}%`
    }
    else {
      top = `${indicator}%`
    }
    return {
      top
    }
  }

  const getGravityVector = async () => {
    if (typeof window !== 'undefined') {
      const response = await window.DeviceMotionEvent.requestPermission()
      if (response === 'granted') {
        window.addEventListener("devicemotion", function (event) {
          const x = event.accelerationIncludingGravity.x;
          const y = event.accelerationIncludingGravity.y;
          const z = event.accelerationIncludingGravity.z;

          setGravityVector({ x, y, z })
        }, true);
      }
    }
  }

  const getGravityVectorAndroid = async () => {
    if (typeof window !== 'undefined') {
        window.addEventListener("devicemotion", function (event) {
          const x = event.accelerationIncludingGravity.x;
          const y = event.accelerationIncludingGravity.y;
          const z = event.accelerationIncludingGravity.z;

          setGravityVector({ x, y, z })
        }, true);
    }
  }

  const takePic = async () => {
    const blob = await takePhoto(videoRef.current);
    const myImage = await blobToBase64(blob)
    if(isIOSDevice()){
      getGravityVector()
    }
    else{
      getGravityVectorAndroid()
    }
    onCapturePressed(myImage, gravityVector)
    navigate('/home/photo-two')
  }

  function startCameraStream() {
    startStream(user.cameraFace).then((stream) => {
      videoRef.current.srcObject = stream
      videoRef.current.play()
    }).catch((err) => {
      console.log(err)
    })
  }

  function isIOSDevice(){
    return !!navigator.platform && /MacIntel|iPhone|iPod/.test(navigator.platform);
 }

  const getXAxisOrientation = async () => {
    if (typeof window !== 'undefined') {
      const response = await window.DeviceOrientationEvent.requestPermission()
      if (response === 'granted') {
        window.addEventListener("deviceorientation", function (event) {
          setXAxisOrientation(event.beta)
        }, true);
        startCameraStream()
      }
    }
  }

  const getXAxisOrientationAndroid = async () => {
    if (typeof window !== 'undefined') {
        window.addEventListener("deviceorientation", function (event) {
          setXAxisOrientation(event.beta)
        }, true);
        startCameraStream()
    }
  }

  const handleAuth = async () => {
    if(isIOSDevice()){
      await getXAxisOrientation()
    }
    else{
      await getXAxisOrientationAndroid()
    }
    setPrompt('hidden')
  }

  const displaySpeaker = () => { if (user.voice) return <AudioPlayer /> }

  return (
    <div className="pt-4">
      {displaySpeaker()}
      {user.cameraFace === 'user' ?
        <Video
          className="h-70vh w-full mb-2"
          ref={videoRef}
          autoPlay
          playsInline
        /> :
        <video
          className="h-70vh w-full mb-2"
          ref={videoRef}
          autoPlay
          playsInline
        />
      }
      <div className="h-40 px-4">
        {prompt === 'hidden' ? <FadingText cameraFace={user.cameraFace} takePic={takePic} setCaptureBtn={setCaptureBtn} /> : <div />}
      </div>
      <div className="absolute right-3% w-1/12 top-33%">
        <div className="relative h-33vh border-gray-500 border-2 rounded-lg">
          <div style={getIndicatorPosition()} className="absolute w-full border-solid border-2 border-black z-10 rounded-lg" />
          <div className="absolute w-full bg-blue-500 z-0 rounded-lg h-50% top-25%" />
        </div>
      </div>
      <div className={`${captureBtn} absolute bottom-3vh text-center w-full`}>
        <button
          onClick={async () => await takePic()}
          className="bg-gray-600 p-16 rounded-full"
        />
      </div>
      <div className={`${prompt} w-full absolute top-33% text-center z-20`}>
        <div className="w-8/12 bg-popup.blue top-33% h-33vh m-auto rounded-lg border-4 border-popup.red.border">
          <img
            className="h-10 w-6 ml-auto mr-4"
            alt="close-icon"
            src={CloseIconSvg}
            onClick={() => setPrompt('hidden')}
          />
          <button
            className="h-16 bg-white rounded-full w-9/12 font-Roboto text-lg md:text-xl lg:text-2xl mx-auto mt-12 sm:mt-20 md:mt-32 lg:mt-56"
            onClick={() => handleAuth()}
          >
            Ready
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
  onCapturePressed: (img, gravityVector) => dispatch(saveSecondImage(img, gravityVector)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CapturePic)