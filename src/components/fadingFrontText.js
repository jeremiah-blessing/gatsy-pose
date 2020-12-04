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
  animation: 6s 12s ${fadeOutAnimation};
`;
const LineFiveDiv = styled.div`
  animation: 4s 18s ${fadeOutAnimation};
`;
const LineSixDiv = styled.div`
  animation: 4s 22s ${fadeOutAnimation};
`;
const LineSevenDiv = styled.div`
  animation: 4s 26s ${fadeOutAnimation};
`;
const LineEightDiv = styled.div`
  animation: 4s 30s ${fadeOutAnimation};
`;

const LINE_SEVEN_ALONE = 'The photo will be taken in 3...2...1.'
const LINE_SEVEN_FRIEND = 'Take the photo when ready.'

const FadingText = ({ cameraFace, takePic, setCaptureBtn }) => {

  const lineEight = () => {
    if (cameraFace === 'user') return (
    <LineEightDiv className="opacity-0 w-full text-center text-xl absolute">
      Congratulations the first photo was taken.
    </LineEightDiv>
    )
  }

  useEffect(() => {
    setTimeout(() => {
      cameraFace === 'user' ? takePic() : setCaptureBtn('')
    }, 30000)
  }, [])

  return (
    <div className="relative">
      <LineOneDiv className="opacity-0 w-full text-center text-xl absolute">
        Face the camera and stand up straight.
      </LineOneDiv>
      <LineTwoDiv className="opacity-0 w-full text-center text-xl absolute">
        Ensure your feet are shoulder width apart.
      </LineTwoDiv>
      <LineThreeDiv className="opacity-0 w-full text-center text-xl absolute">
        Have arms relaxed on the side of your body.
      </LineThreeDiv>
      <LineFourDiv className="opacity-0 w-full text-center text-xl absolute">
        Move your arms to the side, NOT to the front, until they are about 45 degrees away from your body.
      </LineFourDiv>
      <LineFiveDiv className="opacity-0 w-full text-center text-xl absolute">
        Clench your hands into fists.
      </LineFiveDiv>
      <LineSixDiv className="opacity-0 w-full text-center text-xl absolute">
        Look directly into the camera.
      </LineSixDiv>
      <LineSevenDiv className="opacity-0 w-full text-center text-xl absolute">
        {cameraFace === 'user' ? LINE_SEVEN_ALONE : LINE_SEVEN_FRIEND}
      </LineSevenDiv>
      {lineEight()}
    </div>
  )
}

export default FadingText