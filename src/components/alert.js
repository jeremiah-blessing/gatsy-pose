import React, { useState, useEffect } from 'react'

const Alert = () => {
  const ALERT_RED = 'bg-alert.red'
  const ALERT_GREEN = 'bg-alert.green'

  const [alertState, setAlertState] = useState(`opacity-0 ${ALERT_RED}`)
  const [alertText, setAlertText] = useState('')

  const getAlertDetails = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search
      const params = search && new URLSearchParams(search)
      const alert = params && params.get('alert')

      if (alert) {
        switch (alert) {
          case "forgot_pass_success":
            setAlertText("Please check your email to reset your password")
            setAlertState(`opacity-100 ${ALERT_GREEN}`)
            break;
          case "forgot_pass_fail":
            setAlertText("There is no account associated with that email")
            setAlertState(`opacity-100 ${ALERT_RED}`)
            break;
          case "reset_success":
            setAlertText("Password has been reset, please Login.")
            setAlertState(`opacity-100 ${ALERT_GREEN}`)
            break;
          case "reset_fail":
            setAlertText("Password could not be updated")
            setAlertState(`opacity-100 ${ALERT_RED}`)
            break;
          case "login_fail":
            setAlertText("Please check login details are correct.")
            setAlertState(`opacity-100 ${ALERT_RED}`)
            break;
          case "register_missing_fields":
            setAlertText("Please fill in all the required fields.")
            setAlertState(`opacity-100 ${ALERT_RED}`)
            break;
          case "register_missing_terms":
            setAlertText("Please agree to the terms of use to register.")
            setAlertState(`opacity-100 ${ALERT_RED}`)
            break;
          case "sign_up_fail":
            setAlertText("Please enter a valid email")
            setAlertState(`opacity-100 ${ALERT_RED}`)
            break;
          default:
          }
        }
      }
  }

  useEffect(() => {
    getAlertDetails()
  })

  return (
    <p className={`${alertState} text-white text-center text-xs font-Roboto`}>
      {alertText}
    </p>
  )
}

export default Alert
