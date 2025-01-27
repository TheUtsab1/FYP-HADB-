import React from 'react'


import { Footer } from './container'
import { Outlet } from 'react-router-dom'
import { Navbar } from './components'

export const Applayout = () => {
  return (
    <div>
        
        <Navbar />
        {/* <Header /> */}
        <Outlet />
        {/* <Footer /> */}
    </div>
  )
}
