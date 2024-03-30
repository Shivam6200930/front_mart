import React from 'react'
import './pagenotfound.css'
function pageNotFound() {
  return (
    <>
      <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="bounce">404</h1>
        <p>Oops! Page not found</p>
        <p>Looks like you've wandered into uncharted territory.</p>
        
          <a href="/">Go back to Shivam Mart</a>
      
      </div>
    </div>
    </>
  )
}

export default pageNotFound
