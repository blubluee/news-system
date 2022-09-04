import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
import Sandbox from '../views/sandbox/Sandbox'
export default function IndexRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/news" element={<News/>} />
      <Route path="/detail/:id" element={<Detail/>} />
      <Route
        path="/*"
        element={(() => {
          return localStorage.getItem('token') ? (
            <Sandbox />
          ) : (
            <Navigate to="/login" replace={true} />
          )
        })()}
      />
    </Routes>
  )
}
