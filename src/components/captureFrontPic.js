import React, { useRef, useState, useEffect } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { blobToBase64 } from "base64-blob"
import { startStream, takePhoto, getWidth, getHeight } from "../utils/camUtils"
import { saveFirstImage } from "../store/thunk"

import FadingText from "./fadingFrontText"
import AudioPlayer from "./audioPlayer"
import CloseIconSvg from "../images/x-svg.svg"

//This leads to a bug with Chokidar about the amount of file watchers
//using this script fixes it in local.
//sudo sysctl -p
//sudo sysctl fs.inotify.max_user_watches=524288

// require("@tensorflow/tfjs-backend-webgl");
//The below module needed to run body-pix in component.
import * as tf from "@tensorflow/tfjs"
//body-pix to do segmentation, then based on pixel location, run a check.
import * as bodyPix from "@tensorflow-models/body-pix"
import { canBeRepresented } from "@tensorflow/tfjs-backend-webgl/dist/webgl_util"

// ONLY ADD THIS WHEN USING FRONT FACE CAM
const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`

// BodyPix setup
const segmentPersonConfig = {
  flipHorizontal: true, // Flip for webcam
  maxDetections: 1, // only look at one person in this model
  scoreThreshold: 0.5,
  segmentationThreshold: 0.6, // default is 0.7
}

const CapturePic = ({ navigate, user, onCapturePressed }) => {
  const [gravityVector, setGravityVector] = useState({ x: "", y: "", z: "" })
  const [xAxisOrientation, setXAxisOrientation] = useState(90)
  const [captureBtn, setCaptureBtn] = useState("hidden")
  const [prompt, setPrompt] = useState("")
  const videoRef = useRef()
  const streamRef = useRef()
  const canvasRef = useRef()
  const drawingCanvasRef = useRef()
  const trackRef = useRef()

  // Temperory stat
  const sPartRef = useRef()
  const sLHandRef = useRef()
  const sRHandRef = useRef()
  const sLegRef = useRef()

  const [model, setModel] = useState(null)
  const [predicting, setPredicting] = useState(false)
  const [updating, setUpdating] = useState(false)

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

        const results = (
          await (
            await fetch("http://localhost:4000/analyze-front-pic", {
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

        if (results === null) return

        let successColor = "rgb(16, 185, 129)",
          failureColor = "rgb(239, 68, 68)"
        if (!results.ifAllPartsAreVisible) {
          sPartRef.current.style.backgroundColor = failureColor
          sLHandRef.current.style.backgroundColor = failureColor
          sRHandRef.current.style.backgroundColor = failureColor
          sLegRef.current.style.backgroundColor = failureColor
        } else {
          sPartRef.current.style.backgroundColor = results.ifAllPartsAreVisible
            ? successColor
            : failureColor
          sLHandRef.current.style.backgroundColor = results.leftHandCorrect
            ? successColor
            : failureColor
          sRHandRef.current.style.backgroundColor = results.rightHandCorrect
            ? successColor
            : failureColor
          sLegRef.current.style.backgroundColor = results.legsCorrect
            ? successColor
            : failureColor
        }

        // var ctx = canvasRef.current.getContext("2d")
        // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // let keyPoints = segmentation.allPoses[0].keypoints

        // keyPoints.forEach(el => {
        //   ctx.fillStyle = "#DF2935"
        //   ctx.fillRect(el.position.x, el.position.y, 10, 10)
        // })
        return
      } catch (error) {
        console.log(error)
      }
    }, 100)
  }

  //   // Segmentation https://developer.mozilla.org/en-US/docs/Web/API/MediaStream mediastream object
  //   const canvas = videoRef.current.srcObject;
  //   const { data:map } = await net.segmentPerson(canvas, {
  //     internalResolution: 'full',
  //   });

  //   console.log(canvas)

  // }

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
    setPredicting(true)

    console.log("Starting Prediction..")
    predict()
  }
  const stopPrediction = () => {
    clearInterval(predictLoop.current)
    setPredicting(false)
    window.predicting = false
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
    onCapturePressed(myImage, gravityVector, {
      width: getWidth(),
      height: getHeight(),
    })
    await navigate("/home/photo-one")
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
        console.log("Access ALLOWED in background for bodypix")
        console.log(`Using video device: ${stream.getVideoTracks()[0].label}`)
        console.log(stream)
        videoRef.current.srcObject = stream
        videoRef.current.play()
        streamRef.current = stream

        setUpdating(false)

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
      !!navigator.platform &&
      /MacIntel|iPad|iPhone|iPod/.test(navigator.platform)
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

  useEffect(() => {
    loadModel()

    // // Set Video element's height and width equal to the Webcam's stream dimensions
    // videoRef.current.height =typeof window !== 'undefined' ? window.innerHeight * window.devicePixelRatio : 1280;
    // videoRef.current.width = typeof window !== 'undefined' ? window.innerWidth * window.devicePixelRatio : 720;

    // // Set Canvas element's height and width equal to the Webcam's stream dimensions
    // canvasRef.current.height =typeof window !== 'undefined' ? window.innerHeight * window.devicePixelRatio : 1280;
    // canvasRef.current.width = typeof window !== 'undefined' ? window.innerWidth * window.devicePixelRatio : 720;

    // Set Video element's height and width equal to the Webcam's stream dimensions
    videoRef.current.height = window.innerHeight
    videoRef.current.width = window.innerWidth

    // Set Canvas element's height and width equal to the Webcam's stream dimensions
    canvasRef.current.height = window.innerHeight
    canvasRef.current.width = window.innerWidth

    // Set Drawing Canvas element's height and width equal to the Webcam's stream dimensions
    drawingCanvasRef.current.height = window.innerHeight
    drawingCanvasRef.current.width = window.innerWidth

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
            className="h-16 bg-white rounded-full w-9/12 font-Roboto text-lg md:text-xl lg:text-2xl mx-auto mt-12 sm:mt-16 md:mt-32 lg:mt-56"
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
        <h1>
          Left Hand Alignment :{" "}
          <span
            ref={sLHandRef}
            className="ml-1 w-3 h-3 rounded-full inline-block"
          ></span>
        </h1>
        <h1>
          Right Hand Alignment :{" "}
          <span
            ref={sRHandRef}
            className="ml-1 w-3 h-3 rounded-full inline-block"
          ></span>
        </h1>
        <h1>
          Legs Alignment :{" "}
          <span
            ref={sLegRef}
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
  onCapturePressed: (img, gravityVector, dimensions) =>
    dispatch(saveFirstImage(img, gravityVector, dimensions)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CapturePic)

function analysePrediction(predictions) {
  let nScore = 0.7 // Needed Score
  let keyPoints = predictions.allPoses[0].keypoints

  let leftShoulder = keyPoints[5]
  let rightShoulder = keyPoints[6]
  let leftElbow = keyPoints[7]
  let rightElbow = keyPoints[8]

  let leftHip = keyPoints[11]
  let rightHip = keyPoints[12]
  let leftKnee = keyPoints[13]
  let rightKnee = keyPoints[14]

  let rightLegAngle = CalculateAngle(
    rightKnee.position.x,
    -1 * rightKnee.position.y,
    rightHip.position.x,
    -1 * rightHip.position.y
  ) // ideal 75 degree

  let leftLegAngle = CalculateAngle(
    leftKnee.position.x,
    -1 * leftKnee.position.y,
    leftHip.position.x,
    -1 * leftHip.position.y
  ) // ideal -75 degree

  // Final Calculation for prediction

  let rightLegCorrect = rightLegAngle > 60 && rightLegAngle < 80
  let leftLegCorrect = leftLegAngle > -80 && leftLegAngle < -60

  let rightHandAngle = Math.abs(
    CalculateAngle(
      rightShoulder.position.x,
      -1 * rightShoulder.position.y,
      rightElbow.position.x,
      -1 * rightElbow.position.y
    )
  ) // Ideal 0° - 20°

  let leftHandAngle = Math.abs(
    CalculateAngle(
      leftShoulder.position.x,
      -1 * leftShoulder.position.y,
      leftElbow.position.x,
      -1 * leftElbow.position.y
    )
  ) // Ideal 0° - 20°

  let legsCorrect = rightLegCorrect && leftLegCorrect
  let leftHandCorrect = leftHandAngle < 21
  let rightHandCorrect = rightHandAngle < 21

  // console.log(legsCorrect, leftHandCorrect, rightHandCorrect)
  let ifAllPartsAreVisible = allPartsVisible(keyPoints)

  return {
    ifAllPartsAreVisible,
    legsCorrect,
    leftHandCorrect,
    rightHandCorrect,
    rightLegAngle,
    leftLegAngle,
  }
  // console.log(allPartsVisible(keyPoints))
}

function CalculateAngle(x1, y1, x2, y2) {
  let slope = (y2 - y1) / (x2 - x1)
  let angle = Math.atan(slope) * (180 / Math.PI)
  return angle
}

function allPartsVisible(keypoints) {
  let neededPoints = [5, 6, 7, 8, 11, 12, 13, 14]

  let visible = true

  keypoints.forEach((el, ind) => {
    if (neededPoints.includes(ind)) {
      if (visible) visible = el.score > 0.5
    }
  })

  return visible
}
