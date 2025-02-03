import react from 'react'
import './Dailog.css'

const Daiog = ({ message, onConfirm, onCancel,onClose }) => {
    return (
      <div className="confirm-dialog">
           
        <div className="confirm-dialog-content">
        <button className="closeButton"onClick={onClose}>✕</button>
          <p>{message}</p>
          <div className="confirm-dialog-buttons">
            <button onClick={onConfirm}>Update</button>
            <button onClick={onCancel}>Delete</button>
          </div>
        </div>
      </div>
    );
  };

  export default Daiog;