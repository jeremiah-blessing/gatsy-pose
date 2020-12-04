export const getHeight = () => typeof window !== 'undefined' ? window.innerHeight * window.devicePixelRatio : 1280

export const getWidth = () => typeof window !== 'undefined' ? window.innerWidth * window.devicePixelRatio : 720

const streamConstraints = {
  video: {
    facingMode: '',
    // BECAUSE OF THE DEVICE ORIENTATION
    height: { ideal: getWidth()},
    width: { ideal: getHeight() },
  },
};

export const startStream = async (facingMode) => {
  streamConstraints.video.facingMode = facingMode
  //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  const stream = await navigator.mediaDevices.getUserMedia(streamConstraints);

  return stream;
}

export const takePhoto = async (video) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);

  return await canvasToBlob(canvas, 'image/jpeg');
}

const canvasToBlob = async (canvas, type) => {
  if (canvas.toBlob) {
    const result = new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type);
    });
    return result;
  } else {
    const dataURL = canvas.toDataURL(type);
    const buffer = dataUrlToArrayBuffer(dataURL);
    return new Blob([buffer], { type });
  }
}

const dataUrlToArrayBuffer = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return ia.buffer;
}