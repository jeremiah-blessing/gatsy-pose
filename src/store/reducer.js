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

const userInitialState = {
  isSignedIn: true,
  token: null,
  cameraFace: '',
  brands: [],
  measurements: false,
  voice: false
};

export const user = (state = userInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SIGN_IN :
      return {
        ...state,
        isSignedIn: payload.auth,
        token: payload.token,
        brands: payload.brands || [''],
        measurements: payload.measurements
      }
    case SIGN_UP :
      return {
        ...state,
        isSignedIn: payload.auth,
        token: payload.token,
        brands: payload.brands || ['']
      }
    case LOGOUT :
    case DELETE_ACC:
      return {
        ...state,
        isSignedIn: false,
        token: '',
        brands: []
      }
    case SET_CAM_FACE :
      return {
        ...state,
        cameraFace: payload
      }
    case SET_AUDIO :
      return {
        ...state,
        voice: payload
      }
    case ADD_BRAND :
      return {
        ...state,
        brands: [...state.brands, payload]
      }
    case SAVE_MEASUREMENTS :
      return {
        ...state,
        measurements: payload,
      }
    default :
      return state
  }
}

const measureInitialState = {
  gender: null, // 0 Female, 1 Male
  heightMetric: '',
  heightImperial: {
    feet: '',
    inches: ''
  },
  heightUnit: 'Metric',
  age: 0,
  dateOfBirth: '',
  weightMetric: '',
  weightImperial: '',
  weightUnit: 'Metric',
  picture_height: 0,
  picture_width: 0,
  horizontal_angle: 73.74,
  vertical_angle: 53.13,
  gx0: 0,
  gy0: 0,
  gz0: 0,
  gx1: 0,
  gy1: 0,
  gz1: 0,
  firstImage: '',
  secondImage: '',
  metric: true
};

export const measure = (state = measureInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_DETAILS :
      return {
        ...state,
        gender: payload.gender,
        heightMetric: payload.heightMetric,
        heightImperial: payload.heightImperial,
        heightUnit: payload.heightUnit,
        age: payload.age,
        dateOfBirth: payload.dateOfBirth,
        weightMetric: payload.weightMetric,
        weightImperial: payload.weightImperial,
        weightUnit: payload.weightUnit,
        metric: payload.unit
      }
    case SET_FIRST_IMG :
      return {
        ...state,
        picture_height: payload.dimensions.height,
        picture_width: payload.dimensions.width,
        gx0: payload.gravityVector.x,
        gy0: payload.gravityVector.y,
        gz0: payload.gravityVector.z,
        firstImage: payload.base64Img
      }
    case SET_SECOND_IMG :
      return {
        ...state,
        gx1: payload.gravityVector.x,
        gy1: payload.gravityVector.y,
        gz1: payload.gravityVector.z,
        secondImage: payload.base64Img
      }
    case SET_SYSTEM_OF_UNITS :
      return {
        ...state,
        heightUnit: payload.system,
        weightUnit: payload.system,
        metric: payload.metric
      }
    default :
      return state
  }
}