import React from 'react'
import { commonStyles } from '../pages/styles/commonStyles'

function ErrorMessage({message}) {
  return (
    <div style={commonStyles.errorMessage}>
      <p style={commonStyles.errorFont}>{message}</p>
    </div>
  )
}

export default ErrorMessage