import React from 'react'
import Navbar from '../Shared/Navbar/Navbar'
import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}
