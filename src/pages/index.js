import React from 'react'
import Button from '@material-ui/core/Button'

const Index = ( { navigate } ) => {
    return (
      <div>
        <div className="text-center my-3vh m-auto">
          <h1 className="text-xl font-bold m-4 text-gray-600">Home</h1>
          <Button
            style = {{margin : 3}}
            disableElevation
            color="primary"
            variant="contained"
            onClick={() => navigate('/home')}
          >
            Home
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/sign-in')}
          >
            SignIn
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/sign-up')}
          >
            SignUp
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/profile')}
          >
            Profile
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/browse-brands')}
          >
            BrowseBrands
          </Button>
        </div>

        <div className="text-center my-3vh m-auto">
          <h1 className="text-xl font-bold m-4 text-gray-600">Camera</h1>
          <Button
            variant="contained"
            disableElevation 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/photo-one')}
          >
            Photo 1/2
          </Button>
          <Button
            variant="contained" 
            disableElevation
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/photo-two')}
          >
            Photo 2/2
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/capture-front-pic')}
          >
            CaptureFrontPic
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/capture-side-pic')}
          >
            CaptureSidePic
          </Button>
        </div>  

        <div className="text-center my-3vh m-auto">
          <h1 className="text-xl font-bold m-4 text-gray-600">Errors</h1>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/forgot-password')}
          >
            ForgotPassword
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/reset-password')}
          >
            ResetPassword
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/404')}
          >
            404
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/no-connection')}
          >
            No Connection
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/maintenance')}
          >
            Maintenance
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="primary"
            onClick={() => navigate('/home/processing')}
          >
            Processing
          </Button> 
        </div>

        <div className="text-center my-3vh m-auto">
          <h1 className="text-xl font-bold m-4 text-gray-600">Steps</h1>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/step-one')}
          >
            StepOne
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/step-two')}
          >
            StepTwo
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/step-three')}
          >
            StepThree
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/step-four')}
          >
            StepFour
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/step-five')}
          >
            StepFive
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/step-six')}
          >
            StepSix
          </Button>
          <Button
            variant="contained" 
            style = {{margin : 3}}
            disableElevation
            color="secondary"
            onClick={() => navigate('/home/step-seven')}
          >
            StepSeven
          </Button>
        </div>
      </div>
    )
}

export default Index
