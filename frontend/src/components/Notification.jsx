import React from 'react'
import '../Notifications.css'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`notification ${type}`}>
      <div className="icon"></div>
      {message}
    </div>
  )
}

export default Notification