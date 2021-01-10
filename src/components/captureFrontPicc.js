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
    try {
      const pose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: false,
      })
      let keyPoints = pose.keypoints

      // FOR DEBUG
      // var ctx = canvasRef.current.getContext("2d")
      // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      // keyPoints.forEach(el => {
      //   ctx.fillStyle = "#DF2935"
      //   ctx.fillRect(el.position.x, el.position.y, 10, 10)
      // })

      let result = analysePrediction(keyPoints)

      setResultModal(result)
    } catch (error) {
      console.log(error)
    }
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
        <Silhoute />
      </div>
      <button
        className="fixed top-0 right-0 px-8 rounded-bl-xl py-2 text-white z-50 bg-purple-600 hover:bg-purple-700"
        onClick={handlePrediction}
      >
        Predict
      </button>
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

  let rightLegCorrect = rightLegAngle > 50 && rightLegAngle < 85
  let leftLegCorrect = leftLegAngle > -85 && leftLegAngle < -50
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

function ResultModal({ result }) {
  const WrongIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 h-5 w-5 text-white"
    >
      <circle
        className="text-red-500"
        fill="currentColor"
        cx="12"
        cy="12"
        r="10"
      ></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  )

  const CorrectIcon = () => (
    <svg
      className="flex-shrink-0 h-5 w-5 text-green-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      />
    </svg>
  )

  console.log(result)

  return (
    <div className="z-50 absolute top-0 left-0 h-full w-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-6/7">
        <div className="flex items-center justify-center flex-col">
          {result.success ? (
            <>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-32 w-32 mt-3 text-green-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>

              <h1 className="text-green-500 font-semibold">Correct Pose</h1>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-32 w-32 mt-3 text-white"
              >
                <circle
                  className="text-red-500"
                  fill="currentColor"
                  cx="12"
                  cy="12"
                  r="10"
                ></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <h1 className="text-red-500 font-semibold">Wrong Pose</h1>
            </>
          )}
        </div>
        <div className="text-base mt-2 leading-6 text-gray-700 sm:text-lg sm:leading-7">
          <p className="text-sm font-bold">Requirements</p>
          <ul className="list-disc space-y-2 mt-3 text-sm">
            <li className="flex items-start">
              <span className="h-6 flex items-center sm:h-7">
                {result.ifAllPartsAreVisible ? <CorrectIcon /> : <WrongIcon />}
              </span>
              <p className="ml-2">All Parts are Visible</p>
            </li>
            <li className="flex items-start">
              <span className="h-6 flex items-center sm:h-7">
                {result.legsCorrect ? <CorrectIcon /> : <WrongIcon />}
              </span>
              <p className="ml-2">Correct Leg Position</p>
            </li>
            <li className="flex items-start">
              <span className="h-6 flex items-center sm:h-7">
                {result.handsCorrect ? <CorrectIcon /> : <WrongIcon />}
              </span>
              <p className="ml-2">Correct Hand Position</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Silhoute() {
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
      fill="white"
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
