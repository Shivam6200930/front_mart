import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header_admin/Header_admin'
import Footer from '../../footer/Footer'

function Layout_admin() {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout_admin
