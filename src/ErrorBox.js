import React from 'react'
import { Alert } from '@mui/material'

function ErrorBox(props) {
  return (
    <div>
    {props.errorList.map((msg, index) => (
        <Alert key={index} severity="error">{msg}</Alert>
    ))}
    </div>
  )
}

export default ErrorBox