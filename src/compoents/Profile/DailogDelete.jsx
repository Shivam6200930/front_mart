import React from 'react'
import './Dailog.css'
function DailogDelete({message,onConfirm,onCancel,onClose}) {
  return (
    <>
      <div className="confirm-dialog">
           
           <div className="confirm-dialog-content">

           <button className="closeButton"onClick={onClose}>✕</button>
           <p>{message}</p>
             <div className="confirm-dialog-buttons">
               <button onClick={onConfirm}>Delete</button>
               <button onClick={onCancel}>Cancel</button>
             </div>
           </div>
         </div>
    </>
  )
}

export default DailogDelete
