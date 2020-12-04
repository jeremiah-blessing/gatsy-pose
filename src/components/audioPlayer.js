import React, { useState } from 'react'
import SpeakerIcon from '../../src/images/speaker-icon.png'

const AudioPlayer = () => {
  const [playbackOn, setPlaybackOn] = useState(false);

  const handleClick = () => {
    playbackOn ? document.getElementById('audio-file').pause() : document.getElementById('audio-file').play()
    setPlaybackOn(!playbackOn)
  }

  return (
    <div>
      <audio id="audio-file" >
        <source src="https://esatta-audio.s3.amazonaws.com/AronChupa-ImAnAlbatraoz.mp3" />
      </audio>
      <div className="absolute top-0 right-0 z-10 flex justify-end">
        <button className="w-1/5 mr-1 mt-16" onClick={() => handleClick()}>
          <img alt="speaker" src={SpeakerIcon} />
        </button>
      </div>
    </div>
  )
}

export default AudioPlayer