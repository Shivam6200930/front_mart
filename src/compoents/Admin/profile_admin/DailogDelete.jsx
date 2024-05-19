import React from 'react'
import './Dailog.css'
function DailogDelete({message,onConfirm,onCancel,onClose}) {
  return (
    <>
      <div className="confirm-dialog">
           
           <div className="confirm-dialog-content">
           <button className="closeButton"onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></button>
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
