import React, { useEffect, useRef, useState } from "react"

import * as tf from "@tensorflow/tfjs"
import * as posenet from "@tensorflow-models/posenet"
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm"

export default function CaptureSidePicc() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const ctxRef = useRef(null)
  const canvasRef = useRef(null)

  const [model, setModel] = useState(null)
  const [resultModal, setResultModal] = useState(false)
  const [success, setSuccess] = useState(null)
  const [prediction, setPrediction] = useState("stopped") // "stopped", "progress","capturing", "completed"

  function startCameraStream() {
    let displayRatio = window.innerWidth / window.innerHeight

    let uWidth = 300
    let uHeight = Math.round(300 / displayRatio)

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: uWidth,
          height: uHeight,
          facingMode: "user",
        },
      })
      .then(stream => {
        console.log("Camera access ALLOWED in background for bodypix")
        console.log(`Using video device: ${stream.getVideoTracks()[0].label}`)
        videoRef.current.srcObject = stream
        videoRef.current.play()
        streamRef.current = stream
      })
      .catch(err => {
        console.error(err)
        console.log("Camera access DENIED in background for bodypix")
      })
  }

  const handlePrediction = async () => {
    setPrediction("progress")
    window.poseDuration = 0
    window.predictionLoop = setInterval(async () => {
      try {
        const pose = await model.estimateSinglePose(videoRef.current, {
          flipHorizontal: false,
        })
        let keyPoints = pose.keypoints
        let result = allPartsVisible(keyPoints)

        if (result.success) {
          window.poseDuration++
          setSuccess(true)
        } else {
          window.poseDuration = 0
          setSuccess(false)
        }

        if (window.poseDuration >= 3) {
          // 3 prediction right
          clearInterval(window.predictionLoop)
          setPrediction("capturing")
          captureImage()
        }
      } catch (error) {
        console.log(error)
      }
    }, 1000)
  }

  const captureImage = () => {
    setTimeout(() => {
      setResultModal(true)
      setPrediction("completed")
      // SAVE IMAGE FROM THE VIDEO ELEMENT
    }, 3000)
    // alert("Captured")
  }

  useEffect(() => {
    loadModel()

    let displayRatio = window.innerWidth / window.innerHeight

    let uWidth = 300
    let uHeight = Math.round(300 / displayRatio)

    videoRef.current.height = uHeight
    videoRef.current.width = uWidth

    canvasRef.current.height = uHeight
    canvasRef.current.width = uWidth

    // Initiate Camera Stream
    startCameraStream()
  }, [])

  const loadModel = async () => {
    setWasmPaths("/")
    await tf.setBackend("wasm")
    let loadedModel = await posenet.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
    })

    setModel(loadedModel)
    console.log("Posenet Model Loaded..")
  }

  return (
    <div className="relative h-screen w-screen">
      {resultModal && <ResultModal result={resultModal} />}
      {/* <div className="absolute top-0 left-0 h-full w-full z-40">
        <Silhoute success={success} />
      </div> */}

      <style jsx="true">
        {/* FROM loading.io */}
        {`
          .lds-grid {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
          }
          .lds-grid div {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #fff;
            animation: lds-grid 1.2s linear infinite;
          }
          .lds-grid div:nth-child(1) {
            top: 8px;
            left: 8px;
            animation-delay: 0s;
          }
          .lds-grid div:nth-child(2) {
            top: 8px;
            left: 32px;
            animation-delay: -0.4s;
          }
          .lds-grid div:nth-child(3) {
            top: 8px;
            left: 56px;
            animation-delay: -0.8s;
          }
          .lds-grid div:nth-child(4) {
            top: 32px;
            left: 8px;
            animation-delay: -0.4s;
          }
          .lds-grid div:nth-child(5) {
            top: 32px;
            left: 32px;
            animation-delay: -0.8s;
          }
          .lds-grid div:nth-child(6) {
            top: 32px;
            left: 56px;
            animation-delay: -1.2s;
          }
          .lds-grid div:nth-child(7) {
            top: 56px;
            left: 8px;
            animation-delay: -0.8s;
          }
          .lds-grid div:nth-child(8) {
            top: 56px;
            left: 32px;
            animation-delay: -1.2s;
          }
          .lds-grid div:nth-child(9) {
            top: 56px;
            left: 56px;
            animation-delay: -1.6s;
          }
          @keyframes lds-grid {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>

      {prediction === "progress" && (
        <div className="absolute left-0 bottom-3% z-50 bg-transparent flex items-center justify-center w-full">
          <div className="lds-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      {prediction === "capturing" && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          className="z-50 bg-white shadow-xl rounded-xl flex items-center justify-center w-6/7 flex-col py-8"
        >
          <h1
            style={{ fontSize: "50px", letterSpacing: "2px", color: "#008fd4" }}
          >
            CHEESE!
          </h1>

          <CameraLoader />
        </div>
      )}

      {prediction === "stopped" && model !== null && (
        <button
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          className="px-10 py-3 text-white z-50 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg text-2xl"
          onClick={handlePrediction}
        >
          I'm Ready!
        </button>
      )}
      <canvas
        className="absolute top-0 left-0 h-full w-full z-30"
        ref={canvasRef}
      ></canvas>
      <video
        className="absolute top-0 left-0 h-full w-full"
        ref={videoRef}
      ></video>
    </div>
  )
}

function allPartsVisible(keyPoints) {
  let nScore = 0.7 // Needed Score

  let leftEar = keyPoints[3].score > nScore
  let rightEar = keyPoints[4].score > nScore

  let leftShoulder = keyPoints[5].score > nScore
  let rightShoulder = keyPoints[6].score > nScore

  let leftHip = keyPoints[11].score > nScore
  let rightHip = keyPoints[12].score > nScore

  let leftKnee = keyPoints[13].score > nScore
  let rightKnee = keyPoints[14].score > nScore

  let earVisible = leftEar || rightEar
  let shoulderVisible = leftShoulder || rightShoulder
  let hipVisible = leftHip || rightHip
  let kneeVisible = leftKnee || rightKnee

  let allPartsVisible =
    earVisible && shoulderVisible && hipVisible && kneeVisible

  return { success: allPartsVisible }
}

function ResultModal() {
  const CorrectIcon = () => (
    <svg
      className="flex-shrink-0 h-5 w-5 text-green-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  )

  return (
    <div className="z-50 absolute top-0 left-0 h-full w-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-6/7">
        <div className="flex items-center justify-center flex-col">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-32 w-32 mt-3 text-green-500"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>

          <h1 className="text-green-500 font-semibold flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline h-4 w-4 mr-2"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Photo Taken
          </h1>
        </div>
        <div className="text-base mt-2 leading-6 text-gray-700 sm:text-lg sm:leading-7">
          <p className="text-sm font-bold">Requirements</p>
          <ul className="list-disc space-y-2 mt-3 text-sm">
            <li className="flex items-start">
              <span className="h-6 flex items-center sm:h-7">
                <CorrectIcon />
              </span>
              <p className="ml-2">All Parts are Visible</p>
            </li>
            <li className="flex items-start">
              <span className="h-6 flex items-center sm:h-7">
                <CorrectIcon />
              </span>
              <p className="ml-2">Correct Leg Position</p>
            </li>
            <li className="flex items-start">
              <span className="h-6 flex items-center sm:h-7">
                <CorrectIcon />
              </span>
              <p className="ml-2">Correct Hand Position</p>
            </li>
          </ul>
        </div>
        <div className="w-full flex items-center justify-center">
          <button className="flex items-center justify-center mt-8 focus:outline-none">
            <span className="text-green-500 mr-3 font-semibold">Next</span>
            <div className="p-4 bg-green-500 rounded-full shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <polyline stroke="white" points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function CameraLoader() {
  return (
    <>
      <div className="loadingio-spinner-double-ring-osloader">
        <div className="ldio-loader">
          <div></div>
          <div></div>
          <div>
            <div></div>
          </div>
          <div>
            <div></div>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#008fd4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: "50px",
            height: "50px",
          }}
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </div>
      <style jsx="true">
        {" "}
        {`
          @keyframes ldio-loader {
            0% {
              transform: rotate(0);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          .ldio-loader div {
            box-sizing: border-box !important;
          }
          .ldio-loader > div {
            position: absolute;
            width: 134px;
            height: 134px;
            top: 33px;
            left: 33px;
            border-radius: 50%;
            border: 6px solid #000;
            border-color: #008fd4 transparent #008fd4 transparent;
            animation: ldio-loader 1s linear infinite;
          }

          .ldio-loader > div:nth-child(2),
          .ldio-loader > div:nth-child(4) {
            width: 118px;
            height: 118px;
            top: 41px;
            left: 41px;
            animation: ldio-loader 1s linear infinite reverse;
          }
          .ldio-loader > div:nth-child(2) {
            border-color: transparent #001f2d transparent #001f2d;
          }
          .ldio-loader > div:nth-child(3) {
            border-color: transparent;
          }
          .ldio-loader > div:nth-child(3) div {
            position: absolute;
            width: 100%;
            height: 100%;
            transform: rotate(45deg);
          }
          .ldio-loader > div:nth-child(3) div:before,
          .ldio-loader > div:nth-child(3) div:after {
            content: "";
            display: block;
            position: absolute;
            width: 6px;
            height: 6px;
            top: -6px;
            left: 58px;
            background: #008fd4;
            border-radius: 50%;
            box-shadow: 0 128px 0 0 #008fd4;
          }
          .ldio-loader > div:nth-child(3) div:after {
            left: -6px;
            top: 58px;
            box-shadow: 128px 0 0 0 #008fd4;
          }

          .ldio-loader > div:nth-child(4) {
            border-color: transparent;
          }
          .ldio-loader > div:nth-child(4) div {
            position: absolute;
            width: 100%;
            height: 100%;
            transform: rotate(45deg);
          }
          .ldio-loader > div:nth-child(4) div:before,
          .ldio-loader > div:nth-child(4) div:after {
            content: "";
            display: block;
            position: absolute;
            width: 6px;
            height: 6px;
            top: -6px;
            left: 50px;
            background: #001f2d;
            border-radius: 50%;
            box-shadow: 0 112px 0 0 #001f2d;
          }
          .ldio-loader > div:nth-child(4) div:after {
            left: -6px;
            top: 50px;
            box-shadow: 112px 0 0 0 #001f2d;
          }
          .loadingio-spinner-double-ring-osloader {
            width: 200px;
            height: 200px;
            display: inline-block;
            overflow: hidden;
            position: relative;
          }
          .ldio-loader {
            width: 100%;
            height: 100%;
            position: relative;
            transform: translateZ(0) scale(1);
            backface-visibility: hidden;
            transform-origin: 0 0; /* see note above */
          }
          .ldio-loader div {
            box-sizing: content-box;
          }
          /* generated by https://loading.io/ */
        `}
      </style>
    </>
  )
}
