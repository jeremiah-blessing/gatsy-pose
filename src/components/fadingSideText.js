import React, { useEffect } from 'react'
import styled, { keyframes } from 'styled-components';
import { fadeOut } from 'react-animations';

const fadeOutAnimation = keyframes`${fadeOut}`;

// duration delay

const LineOneDiv = styled.div`
  animation: 4s ${fadeOutAnimation};
`;
const LineTwoDiv = styled.div`
  animation: 4s 4s ${fadeOutAnimation};
`;
const LineThreeDiv = styled.div`
  animation: 4s 8s ${fadeOutAnimation};
`;
const LineFourDiv = styled.div`
  animation: 4s 12s ${fadeOutAnimation};
`;
const LineFiveDiv = styled.div`
  animation: 4s 16s ${fadeOutAnimation};
`;

const LINE_FIVE_ALONE = 'The photo will be taken in 3...2...1.'
const LINE_FIVE_FRIEND = 'Take the photo when ready.'

const FadingText = ({ cameraFace, takePic, setCaptureBtn }) => {

  useEffect(() => {
    setTimeout(() => {
      cameraFace === 'user' ? takePic() : setCaptureBtn('')
    }, 20000)
  }, [])

  return (
    <div className="relative">
      <LineOneDiv className="opacity-0 w-full text-center text-xl absolute">
        Turn to your left so that your SIDE is to the camera.
      </LineOneDiv>
      <LineTwoDiv className="opacity-0 w-full text-center text-xl absolute">
        Stand straight with your feet shoulder width apart.
      </LineTwoDiv>
      <LineThreeDiv className="opacity-0 w-full text-center text-xl absolute">
        Have arms relaxed against the side of your body.
      </LineThreeDiv>
      <LineFourDiv className="opacity-0 w-full text-center text-xl absolute">
        Do not look at the camera. Instead face directly ahead.
      </LineFourDiv>
      <LineFiveDiv className="opacity-0 w-full text-center text-xl absolute">
        {cameraFace === 'user' ? LINE_FIVE_ALONE : LINE_FIVE_FRIEND}
      </LineFiveDiv>
    </div>
  )
}

export default FadingText