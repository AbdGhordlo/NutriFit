import React from 'react'
import "../assets/commonStyles.css";

function ErrorMessage({message}) {
  return (
    <div className='error-message'>
      <p className='error-font'>{message}</p>
    </div>
  )
}

export default ErrorMessage