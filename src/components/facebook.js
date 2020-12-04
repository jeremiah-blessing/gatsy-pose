import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import FacebookIcon from '../images/facebook-icon.png'
import { fbLogin } from '../store/thunk'

const Facebook = ({ user, onLoginPressed, navigate }) => {
  const [domain, setDomain] = useState('')
  let fbContent

  const responseFacebook = response => {
    if (response.error) {
      navigate('/home/sign-in?alert=login_fail')
    } else {
      const {email, accessToken} = response
      onLoginPressed({ email, input_token: accessToken, navigate })
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') setDomain(window.location.origin)
  })

  if (user.isSignedIn) {
    fbContent = <img className="w-12 h-12" alt="login" src={FacebookIcon} />
  } else {
    fbContent = (
      <FacebookLogin
        appId="799763647459228"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        redirectUri={`${domain}/sign-in`}
        render={renderProps => (
          <img onClick={renderProps.onClick} className="w-12 h-12" alt="login" src={FacebookIcon} />
        )} />
    )
  }
  return (
    <div className="mx-4">
      {fbContent}
    </div>
  )

}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  onLoginPressed: (credentials) => dispatch(fbLogin(credentials)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Facebook)