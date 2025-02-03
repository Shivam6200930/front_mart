import React from 'react'
import { Outlet } from 'react-router-dom'
import Header_admin from './components_admin/Header_admin'
import Footer from '../compoents/footer/Footer'

function Layout_admin() {
  return (
    <>
    <Header_admin />
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout_admin
