import {
  SIGN_IN,
  SIGN_UP,
  LOGOUT,
  DELETE_ACC,
  ADD_BRAND,
  SET_AUDIO,
  SET_DETAILS,
  SET_CAM_FACE,
  SET_FIRST_IMG,
  SET_SECOND_IMG,
  SET_SYSTEM_OF_UNITS,
  SAVE_MEASUREMENTS
} from './types'

const fetch = require('node-fetch');

export const login = ({email, password, navigate}) => dispatch => {
  try {
    const body = JSON.stringify({ email, password });
    fetch('https://frozen-beach-37273.herokuapp.com/sign-in', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body,
    })
      .then( data => data.json() )
      .then( payload => {
        if (!payload.auth) navigate('/home/sign-in?alert=login_fail')
        dispatch({
          type: SIGN_IN,
          payload,
        })
      })
  } catch (e) {
    dispatch(console.log('Error ', e));
  }
}

export const signup = ({email, password, navigate}) => dispatch => {
  try {
    const body = JSON.stringify({ email, password });
    fetch('https://frozen-beach-37273.herokuapp.com/sign-up', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body,
    })
      .then( data => data.json() )
      .then( payload => {
        if (!payload.auth) navigate('/home/sign-up?alert=sign_up_fail')
        dispatch({
          type: SIGN_UP,
          payload,
        })
      })
  } catch (e) {
    dispatch(console.log('Error ', e));
  }
}

export const deleteAcc = ({ token, setShowPopup}) => dispatch => {
  try {
    const body = JSON.stringify({ token });
    fetch('https://frozen-beach-37273.herokuapp.com/delete-acc', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body,
    })
      .then(data => data.json())
      .then(payload => {
        setShowPopup('block')
        dispatch({
          type: DELETE_ACC,
          payload,
        })
      })
  } catch (e) {
    dispatch(console.log('Error ', e));
  }
}

export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT,
    payload: ''
  })
}

export const setMeasureDetails = (details) => dispatch => {
  dispatch({
    type: SET_DETAILS,
    payload: details
  })
}

export const setSystemOfUnits = (details) => dispatch => {
  dispatch({
    type: SET_SYSTEM_OF_UNITS,
    payload: details
  })
}

export const saveFirstImage = (base64Img, gravityVector, dimensions) => dispatch => {
  dispatch({
    type: SET_FIRST_IMG,
    payload: { base64Img, gravityVector, dimensions}
  })
}

export const saveSecondImage = (base64Img, gravityVector) => dispatch => {
  dispatch({
    type: SET_SECOND_IMG,
    payload: { base64Img, gravityVector }
  })
}

export const setCameraFace = (direction) => dispatch => {
  dispatch({
    type: SET_CAM_FACE,
    payload: direction
  })
}

export const setVoicePref = (preference) => dispatch => {
  dispatch({
    type: SET_AUDIO,
    payload: preference
  })
}

export const sendDataToBackend = (data) => dispatch => {
  const bodyData = {
    gender: data.gender,
    height: data.height,
    age: data.age,
    weight: data.weight,
    picture_height: data.picture_height,
    picture_width: data.picture_width,
    horizontal_angle: data.horizontal_angle,
    vertical_angle: data.vertical_angle,
    gx0: data.gx0,
    gy0: data.gy0,
    gz0: data.gz0,
    gx1: data.gx1,
    gy1: data.gy1,
    gz1: data.gz1,
    token: data.token,
    firstImage: data.firstImage,
    secondImage: data.secondImage,
  }

  const body = JSON.stringify(bodyData);
  try {
    fetch('https://frozen-beach-37273.herokuapp.com/save-data', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      body,
    }).then(data => data.json())
      .then(payload => {
        dispatch({
          type: SAVE_MEASUREMENTS,
          payload,
        })
      })
  } catch (e) {
    // TODO SHOW USER THE ERROR AND ASK THEM TO RETAKE PHOTOS
  }
}

export const fbLogin = ({email, input_token, navigate}) => dispatch => {
  try {
    const body = JSON.stringify({ email, input_token });
    fetch('https://frozen-beach-37273.herokuapp.com/fb/sign-in', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body,
    })
      .then(data => data.json())
      .then(payload => {
        if (!payload.auth) navigate('/home/sign-in?alert=login_fail')
        dispatch({
          type: SIGN_IN,
          payload,
        })
      })
  } catch (e) {
    dispatch(console.log('Error ', e));
  }
}

export const googleLogin = ({email, tokenId, navigate}) => dispatch => {
  try {
    const body = JSON.stringify({ email, tokenId });
    fetch('https://frozen-beach-37273.herokuapp.com/google/sign-in', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body,
    })
      .then(data => data.json())
      .then(payload => {
        if (!payload.auth) navigate('/home/sign-in?alert=login_fail')
        dispatch({
          type: SIGN_IN,
          payload,
        })
      })
  } catch (e) {
    dispatch(console.log('Error ', e));
  }
}

export const addBrand = ({ token, brand, navigate }) => dispatch => {
  try {
    const body = JSON.stringify({ token, brand })
    fetch('https://frozen-beach-37273.herokuapp.com/add-brand', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body,
    })
      .then(data => data.json())
      .then(payload => {
        if (!payload.added) navigate('/home/browse-brands?alert=add_brand_failed')
        dispatch({
          type: ADD_BRAND,
          payload: brand,
        })
        navigate('/home/browse-brands?alert=add_brand_success')
      })
  } catch (e) {
    dispatch(console.log('Error ', e));
  }
}