import axios from 'axios'
import React, { useEffect } from 'react'

function OrderHistory() {
    useEffect(async() =>{
        const response = await axios.get(`https://new-backend-s80n.onrender.com/api/users/`)
    })
  return (
    <div>
      
    </div>
  )
}

export default OrderHistory
