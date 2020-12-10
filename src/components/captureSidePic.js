import React, { useRef, useState, useEffect } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { blobToBase64 } from "base64-blob"
import { startStream, takePhoto } from "../utils/camUtils"
import { saveSecondImage } from "../store/thunk"

import FadingText from "./fadingSideText"
import AudioPlayer from "./audioPlayer"
import CloseIconSvg from "../images/x-svg.svg"

import * as bodyPix from "@tensorflow-models/body-pix"

// BodyPix setup
const segmentPersonConfig = {
  flipHorizontal: true, // Flip for webcam
  maxDetections: 1, // only look at one person in this model
  scoreThreshold: 0.5,
  segmentationThreshold: 0.6, // default is 0.7
}

// ONLY ADD THIS WHEN USING FRONT FACE CAM
const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`

const CapturePic = ({ navigate, user, onCapturePressed }) => {
  const [gravityVector, setGravityVector] = useState({ x: "", y: "", z: "" })
  const [xAxisOrientation, setXAxisOrientation] = useState(90)
  const [captureBtn, setCaptureBtn] = useState("hidden")
  const [prompt, setPrompt] = useState("")

  const videoRef = useRef()
  const streamRef = useRef()
  const canvasRef = useRef()
  const drawingCanvasRef = useRef()

  // Temperory stat
  const sPartRef = useRef()

  const [model, setModel] = useState(null)
  const predictLoop = useRef({})

  const predict = () => {
    predictLoop.current = setInterval(async () => {
      try {
        drawingCanvasRef.current
          .getContext("2d")
          .drawImage(
            videoRef.current,
            0,
            0,
            window.innerHeight,
            window.innerWidth
          )
        var resultb64 = drawingCanvasRef.current.toDataURL()

        let successColor = "rgb(16, 185, 129)",
          failureColor = "rgb(239, 68, 68)"

        let visible = (
          await (
            await fetch("http://localhost:4000/analyze-side-pic", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                image: resultb64,
                imageHeight: window.innerHeight,
                imageWidth: window.innerWidth,
              }),
            })
          ).json()
        ).result

        if (visible) sPartRef.current.style.backgroundColor = successColor
        else sPartRef.current.style.backgroundColor = failureColor

        /**
         * Draw red points over keypoints
         */
        var ctx = canvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        let keyPoints = segmentation.allPoses[0].keypoints

        keyPoints.forEach(el => {
          ctx.fillStyle = "#DF2935"
          ctx.fillRect(el.position.x, el.position.y, 10, 10)
        })

        return
      } catch (error) {
        console.log(error)
      }
    }, 100)
  }

  const getIndicatorPosition = () => {
    const indicator = `${100 - Math.floor((xAxisOrientation / 180) * 100)}`
    var top = `${50}%`

    if (indicator > 100) {
      top = `${99}%`
    } else if (indicator < 0) {
      top = `${1}%`
    } else {
      top = `${indicator}%`
    }
    return {
      top,
    }
  }

  const getGravityVector = async () => {
    if (typeof window !== "undefined") {
      const response = await window.DeviceMotionEvent.requestPermission()
      if (response === "granted") {
        window.addEventListener(
          "devicemotion",
          function (event) {
            const x = event.accelerationIncludingGravity.x
            const y = event.accelerationIncludingGravity.y
            const z = event.accelerationIncludingGravity.z

            setGravityVector({ x, y, z })
          },
          true
        )
      }
    }
  }

  const getGravityVectorAndroid = async () => {
    if (typeof window !== "undefined") {
      window.addEventListener(
        "devicemotion",
        function (event) {
          const x = event.accelerationIncludingGravity.x
          const y = event.accelerationIncludingGravity.y
          const z = event.accelerationIncludingGravity.z

          setGravityVector({ x, y, z })
        },
        true
      )
    }
  }

  const takePic = async () => {
    const blob = await takePhoto(videoRef.current)
    const myImage = await blobToBase64(blob)
    if (isIOSDevice()) {
      getGravityVector()
    } else {
      getGravityVectorAndroid()
    }
    onCapturePressed(myImage, gravityVector)
    navigate("/home/photo-two")
  }

  function startCameraStream() {
    // startStream(user.cameraFace).then((stream) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: window.innerWidth,
          height: window.innerHeight,
          facingMode: user.cameraFace === "user" ? "user" : "",
        },
      })
      .then(stream => {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        streamRef.current = stream

        startPrediction()
        // setCameraPermission(true);
      })
      .catch(err => {
        // setCameraPermission(false);
        console.error(err)
        console.log("Access DENIED in background for bodypix")
      })
  }

  function isIOSDevice() {
    return (
      !!navigator.platform && /MacIntel|iPhone|iPod/.test(navigator.platform)
    )
  }

  const getXAxisOrientation = async () => {
    if (typeof window !== "undefined") {
      const response = await window.DeviceOrientationEvent.requestPermission()
      if (response === "granted") {
        window.addEventListener(
          "deviceorientation",
          function (event) {
            setXAxisOrientation(event.beta)
          },
          true
        )
        startCameraStream()
      }
    }
  }

  const getXAxisOrientationAndroid = async () => {
    if (typeof window !== "undefined") {
      window.addEventListener(
        "deviceorientation",
        function (event) {
          setXAxisOrientation(event.beta)
        },
        true
      )
      startCameraStream()
    }
  }

  const handleAuth = async () => {
    if (isIOSDevice()) {
      await getXAxisOrientation()
    } else {
      await getXAxisOrientationAndroid()
    }
    setPrompt("hidden")
  }

  const displaySpeaker = () => {
    if (user.voice) return <AudioPlayer />
  }

  const loadModel = async () => {
    let loadedModel = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    })
    setModel(loadedModel)

    console.log("BodyPix Model Loaded..")
  }

  const startPrediction = () => {
    console.log("Starting Prediction..")
    predict()
  }

  useEffect(() => {
    loadModel()

    // Set Video element's height and width equal to the Webcam's stream dimensions
    videoRef.current.height = window.innerHeight
    videoRef.current.width = window.innerWidth

    // Set Canvas element's height and width equal to the Webcam's stream dimensions
    canvasRef.current.height = window.innerHeight
    canvasRef.current.width = window.innerWidth

    return () => {
      // Clean up
      clearInterval(predictLoop.current)
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }, [])

  return (
    <div className="">
      {displaySpeaker()}
      <div className="relative">
        <canvas ref={canvasRef} className="absolute top-0 left-0"></canvas>
        <canvas ref={drawingCanvasRef} className="hidden"></canvas>
        {/* {user.cameraFace === 'user' ?
  
        <Video
        className="h-70vh w-full mb-2"
        ref={videoRef}
        autoPlay
        playsInline
        /> 
        
        :
        <video
        className="h-70vh w-full mb-2"
        ref={videoRef}
        autoPlay
        playsInline
        />
      } */}
        <video
          // className="h-70vh w-full mb-2"
          className=""
          ref={videoRef}
          autoPlay
          playsInline
        />
      </div>
      <div className="px-4 fixed h-40 bottom-0 left-0 w-full text-white">
        {prompt === "hidden" ? (
          <FadingText
            cameraFace={user.cameraFace}
            takePic={takePic}
            setCaptureBtn={setCaptureBtn}
          />
        ) : (
          <div />
        )}
      </div>
      <div className="absolute right-3% w-1/12 top-33%">
        <div className="relative h-33vh border-gray-500 border-2 rounded-lg">
          <div
            style={getIndicatorPosition()}
            className="absolute w-full border-solid border-2 border-black z-10 rounded-lg"
          />
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
            onClick={() => setPrompt("hidden")}
          />
          <button
            className="h-16 bg-white rounded-full w-9/12 font-Roboto text-lg md:text-xl lg:text-2xl mx-auto mt-12 sm:mt-20 md:mt-32 lg:mt-56"
            onClick={() => handleAuth()}
          >
            Ready
          </button>
        </div>
      </div>
      <div
        // ref={trackRef}
        className="bg-white fixed z-50 top-0 left-0 text-sm text-gray-800 p-2"
      >
        <h1>
          All required parts are visible :{" "}
          <span
            ref={sPartRef}
            className="ml-1 w-3 h-3 rounded-full inline-block"
          ></span>
        </h1>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  onCapturePressed: (img, gravityVector) =>
    dispatch(saveSecondImage(img, gravityVector)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CapturePic)

function allPartsVisible(predictions) {
  let nScore = 0.7 // Needed Score
  let keyPoints = predictions.allPoses[0].keypoints

  let leftEar = keyPoints[3].score > nScore
  let rightEar = keyPoints[4].score > nScore

  let leftShoulder = keyPoints[5].score > nScore
  let rightShoulder = keyPoints[6].score > nScore

  let leftHip = keyPoints[11].score > nScore
  let rightHip = keyPoints[12].score > nScore

  let leftKnee = keyPoints[13].score > nScore
  let rightKnee = keyPoints[14].score > nScore

  // console.log(legsCorrect, leftHandCorrect, rightHandCorrect)
  // let ifAllPartsAreVisible = allPartsVisible(keyPoints)

  let earVisible = leftEar || rightEar
  let shoulderVisible = leftShoulder || rightShoulder
  let hipVisible = leftHip || rightHip
  let kneeVisible = leftKnee || rightKnee

  let allPartsVisible =
    earVisible && shoulderVisible && hipVisible && kneeVisible

  return allPartsVisible
  // console.log(allPartsVisible(keyPoints))
}
