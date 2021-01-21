import React, { useEffect, useRef, useState } from "react"

import * as tf from "@tensorflow/tfjs"
import * as posenet from "@tensorflow-models/posenet"
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm"

export default function CaptureFrontPicc() {
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
        let result = analysePrediction(keyPoints)

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
      <div className="absolute top-0 left-0 h-full w-full z-40">
        <Silhoute success={success} />
      </div>

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

function analysePrediction(keyPoints) {
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

  let rightHandAngle = CalculateAngle(
    rightShoulder.position.x,
    -1 * rightShoulder.position.y,
    rightElbow.position.x,
    -1 * rightElbow.position.y
  )

  let leftHandAngle = CalculateAngle(
    leftShoulder.position.x,
    -1 * leftShoulder.position.y,
    leftElbow.position.x,
    -1 * leftElbow.position.y
  )

  let rightLegCorrect = rightLegAngle > -85 && rightLegAngle < -50
  let leftLegCorrect = leftLegAngle > 50 && leftLegAngle < 85
  let rightHandCorrect = rightHandAngle > 50 && rightHandAngle < 85
  let leftHandCorrect = leftHandAngle > -85 && leftHandAngle < -50

  let legsCorrect = rightLegCorrect && leftLegCorrect
  let handsCorrect = rightHandCorrect && leftHandCorrect
  let ifAllPartsAreVisible = allPartsVisible(keyPoints)

  let errors = [],
    success = legsCorrect && handsCorrect && ifAllPartsAreVisible

  if (!legsCorrect) errors.push("Your Legs are not in position")
  if (!handsCorrect) errors.push("Your Hands are not in position")
  if (!ifAllPartsAreVisible) errors.push("Make sure all the parts are visible")

  return {
    ifAllPartsAreVisible,
    legsCorrect,
    handsCorrect,
    success,
    errors,
  }
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

function Silhoute({ success }) {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 206.326 206.326"
      style={{ enableBackground: "new 0 0 206.326 206.326" }}
      xmlSpace="preserve"
      fill={success ? "#10B981" : "white"}
      className="h-full w-full opacity-50"
    >
      <g>
        <g>
          <path
            d="M104.265,117.959c-0.304,3.58,2.126,22.529,3.38,29.959c0.597,3.52,2.234,9.255,1.645,12.3
   c-0.841,4.244-1.084,9.736-0.621,12.934c0.292,1.942,1.211,10.899-0.104,14.175c-0.688,1.718-1.949,10.522-1.949,10.522
   c-3.285,8.294-1.431,7.886-1.431,7.886c1.017,1.248,2.759,0.098,2.759,0.098c1.327,0.846,2.246-0.201,2.246-0.201
   c1.139,0.943,2.467-0.116,2.467-0.116c1.431,0.743,2.758-0.627,2.758-0.627c0.822,0.414,1.023-0.109,1.023-0.109
   c2.466-0.158-1.376-8.05-1.376-8.05c-0.92-7.088,0.913-11.033,0.913-11.033c6.004-17.805,6.309-22.53,3.909-29.24
   c-0.676-1.937-0.847-2.704-0.536-3.545c0.719-1.941,0.195-9.748,1.072-12.848c1.692-5.979,3.361-21.142,4.231-28.217
   c1.169-9.53-4.141-22.308-4.141-22.308c-1.163-5.2,0.542-23.727,0.542-23.727c2.381,3.705,2.29,10.245,2.29,10.245
   c-0.378,6.859,5.541,17.342,5.541,17.342c2.844,4.332,3.921,8.442,3.921,8.747c0,1.248-0.273,4.269-0.273,4.269l0.109,2.631
   c0.049,0.67,0.426,2.977,0.365,4.092c-0.444,6.862,0.646,5.571,0.646,5.571c0.92,0,1.931-5.522,1.931-5.522
   c0,1.424-0.348,5.687,0.42,7.295c0.919,1.918,1.595-0.329,1.607-0.78c0.243-8.737,0.768-6.448,0.768-6.448
   c0.511,7.088,1.139,8.689,2.265,8.135c0.853-0.407,0.073-8.506,0.073-8.506c1.461,4.811,2.569,5.577,2.569,5.577
   c2.411,1.693,0.92-2.983,0.585-3.909c-1.784-4.92-1.839-6.625-1.839-6.625c2.229,4.421,3.909,4.257,3.909,4.257
   c2.174-0.694-1.9-6.954-4.287-9.953c-1.218-1.528-2.789-3.574-3.245-4.789c-0.743-2.058-1.304-8.674-1.304-8.674
   c-0.225-7.807-2.155-11.198-2.155-11.198c-3.3-5.282-3.921-15.135-3.921-15.135l-0.146-16.635
   c-1.157-11.347-9.518-11.429-9.518-11.429c-8.451-1.258-9.627-3.988-9.627-3.988c-1.79-2.576-0.767-7.514-0.767-7.514
   c1.485-1.208,2.058-4.415,2.058-4.415c2.466-1.891,2.345-4.658,1.206-4.628c-0.914,0.024-0.707-0.733-0.707-0.733
   C115.068,0.636,104.01,0,104.01,0h-1.688c0,0-11.063,0.636-9.523,13.089c0,0,0.207,0.758-0.715,0.733
   c-1.136-0.03-1.242,2.737,1.215,4.628c0,0,0.572,3.206,2.058,4.415c0,0,1.023,4.938-0.767,7.514c0,0-1.172,2.73-9.627,3.988
   c0,0-8.375,0.082-9.514,11.429l-0.158,16.635c0,0-0.609,9.853-3.922,15.135c0,0-1.921,3.392-2.143,11.198
   c0,0-0.563,6.616-1.303,8.674c-0.451,1.209-2.021,3.255-3.249,4.789c-2.408,2.993-6.455,9.24-4.29,9.953
   c0,0,1.689,0.164,3.909-4.257c0,0-0.046,1.693-1.827,6.625c-0.35,0.914-1.839,5.59,0.573,3.909c0,0,1.117-0.767,2.569-5.577
   c0,0-0.779,8.099,0.088,8.506c1.133,0.555,1.751-1.047,2.262-8.135c0,0,0.524-2.289,0.767,6.448
   c0.012,0.451,0.673,2.698,1.596,0.78c0.779-1.608,0.429-5.864,0.429-7.295c0,0,0.999,5.522,1.933,5.522
   c0,0,1.099,1.291,0.648-5.571c-0.073-1.121,0.32-3.422,0.369-4.092l0.106-2.631c0,0-0.274-3.014-0.274-4.269
   c0-0.311,1.078-4.415,3.921-8.747c0,0,5.913-10.488,5.532-17.342c0,0-0.082-6.54,2.299-10.245c0,0,1.69,18.526,0.545,23.727
   c0,0-5.319,12.778-4.146,22.308c0.864,7.094,2.53,22.237,4.226,28.217c0.886,3.094,0.362,10.899,1.072,12.848
   c0.32,0.847,0.152,1.627-0.536,3.545c-2.387,6.71-2.083,11.436,3.921,29.24c0,0,1.848,3.945,0.914,11.033
   c0,0-3.836,7.892-1.379,8.05c0,0,0.192,0.523,1.023,0.109c0,0,1.327,1.37,2.761,0.627c0,0,1.328,1.06,2.463,0.116
   c0,0,0.91,1.047,2.237,0.201c0,0,1.742,1.175,2.777-0.098c0,0,1.839,0.408-1.435-7.886c0,0-1.254-8.793-1.945-10.522
   c-1.318-3.275-0.387-12.251-0.106-14.175c0.453-3.216,0.21-8.695-0.618-12.934c-0.606-3.038,1.035-8.774,1.641-12.3
   c1.245-7.423,3.685-26.373,3.38-29.959l1.008,0.354C103.809,118.312,104.265,117.959,104.265,117.959z"
          />
        </g>
      </g>
    </svg>
  )
}

function CameraLoader() {
  return (
    <>
      <div class="loadingio-spinner-double-ring-osloader">
        <div class="ldio-loader">
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
