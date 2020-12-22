import React, { useEffect, useRef, useState } from "react"

import * as tf from "@tensorflow/tfjs"
import * as posenet from "@tensorflow-models/posenet"
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm"

export default function CaptureFrontPicc() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const ctxRef = useRef(null)
  const canvasRef = useRef(null)

  const markerRef = useRef(null)

  const [model, setModel] = useState(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const predictLoop = useRef(null)

  function startCameraStream() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: window.innerWidth,
          height: window.innerHeight,
          facingMode: "user",
        },
      })
      .then(stream => {
        console.log("Access ALLOWED in background for bodypix")
        console.log(`Using video device: ${stream.getVideoTracks()[0].label}`)
        console.log(stream)
        videoRef.current.srcObject = stream
        videoRef.current.play()
        streamRef.current = stream
      })
      .catch(err => {
        console.error(err)
        console.log("Access DENIED in background for bodypix")
      })
  }

  const startPredicting = () => {
    predictLoop.current = setInterval(() => {
      var tic = new Date().getTime()
      model
        .estimateSinglePose(videoRef.current, {
          flipHorizontal: false,
        })
        .then(pose => {
          var toc = new Date().getTime()
          console.log(toc - tic, " ms")
          console.log(tf.getBackend())
          console.log(pose)

          // Delete this
          var nose = pose.keypoints[0].position
          markerRef.current.style.marginLeft = Math.round(nose.x) + "px"
          markerRef.current.style.marginTop = Math.round(nose.y) + "px"
        })
    }, 1000)
  }

  const stopPredicting = () => clearInterval(predictLoop.current)

  const handlePrediction = () => {
    if (isPredicting) stopPredicting()
    else startPredicting()
    setIsPredicting(current => !current)
  }

  useEffect(() => {
    loadModel()

    videoRef.current.height = window.innerHeight
    videoRef.current.width = window.innerWidth

    // Create a Virtual Canvas
    var canvas = document.createElement("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    var ctx = canvas.getContext("2d")

    canvasRef.current = canvas
    ctxRef.current = ctx

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
    <div className="relative">
      <div
        ref={markerRef}
        className="absolute top-0 left-0 bg-red-600 w-4 h-4 rounded-full z-50"
      ></div>
      <button
        className="fixed top-0 right-0 px-8 rounded-bl-xl py-2 text-white z-50 bg-purple-600 hover:bg-purple-700"
        onClick={handlePrediction}
      >
        {isPredicting ? "Stop" : "Start"}
      </button>
      <video className="absolute top-0 left-0" ref={videoRef}></video>
    </div>
  )
}
