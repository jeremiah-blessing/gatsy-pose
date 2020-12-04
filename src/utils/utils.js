const fetch = require('node-fetch');

export const forgotPassword = async (email, navigate) => {
  const body = JSON.stringify({ email });

  const response = await fetch('https://frozen-beach-37273.herokuapp.com/forgot-password', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body,
  });

  if (response.status === 200) {
    await navigate('/home/sign-in?alert=forgot_pass_success')
  } else {
    await navigate('/home/sign-in?alert=forgot_pass_fail')
  }
}

export const resetPassword = async (password, token, navigate) => {
  const body = JSON.stringify({ password, token })

  const response = await fetch('https://frozen-beach-37273.herokuapp.com/reset-password', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body,
  });

  if (response.status === 200) {
    await navigate('/home/sign-in?alert=reset_success')
  } else {
    await navigate('/home/sign-in?alert=reset_fail')
  }
}

export const getMeasurements = async () => {
  const getTokenBody = {
    client_id: "esatta",
    client_secret: "cdccd89ff5ef2f8df5d29bf46e49aa2e",
    username: "esatta",
    password: "R89.3$6Fdm",
    grant_type: "password",
    idtype_service: 5
  }
  const getTokenOptions = {
    method: 'POST',
    body: JSON.stringify(getTokenBody),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }

  const getTokenResponse = await fetch('https://3dmodel.ibv.org/api/v1/auth/authorize', getTokenOptions);
  const getTokenjson = await getTokenResponse.json();

  const request_code = 'REFLV8'

  const getModelbody = {
    request_code,
    capabilities: "4;"
  }
  const getModelOptions = {
    method: 'POST',
    body: JSON.stringify(getModelbody),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getTokenjson.access_token}`
    }
  }

  const getModelResponse = await fetch('https://3dmodel.ibv.org/api/v1/models/get3d', getModelOptions);
  const getModeljson = await getModelResponse.json();

  console.log(JSON.stringify(getModeljson))
}