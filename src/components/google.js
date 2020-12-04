import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import GoogleLogin from 'react-google-login'
import GoogleIcon from '../images/google-icon.png'
import { googleLogin } from '../store/thunk'

const Google = ({ user, onLoginPressed, navigate }) => {
  let googleContent

  const componentClicked = () => {
    console.log('THIS IS componentClicked')
  }

  const responseGoogle = response => {
    if (response.error) {
      console.log('ERROR: ', response.error)
    } else {
      const { profileObj, tokenId } = response
      const { email } = profileObj
      console.log('HERE ARE THE VALUES: ',email, tokenId)
      onLoginPressed({ email, tokenId, navigate })
    }
  }
  const getDomain = () => {if (typeof window !== 'undefined') return window.location.origin}
  console.log(getDomain())

  if (user.isSignedIn) {
    googleContent = <img className="w-12 h-12" alt="login" src={GoogleIcon} />
  } else {
    googleContent = (
      <GoogleLogin
        clientId="489905583300-bm5er805pnijpl4pctssmhbs9365crd7.apps.googleusercontent.com"
        buttonText="Login"
        onClick={componentClicked}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        render={renderProps => (
          <img onClick={renderProps.onClick} className="w-12 h-12" alt="login" src={GoogleIcon} />
        )}
      />
    )
  }
  return (
    <div className="mx-4">
      {googleContent}
    </div>
  )

}

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  onLoginPressed: (credentials) => dispatch(googleLogin(credentials)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Google)
