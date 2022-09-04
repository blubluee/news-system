import { Layout } from 'antd'
import { Navigate, useLocation } from 'react-router-dom'
import React from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './Sandbox.css'
import NewsRouter from '../../components/sandbox/NewsRouter'

const { Content } = Layout
export default function Sandbox () {
  const location = useLocation()
  if (!localStorage.getItem('token')) {
    return (
      <Navigate to="/login"/>
    )
  }

  return (
    <Layout>
      <SideMenu currentPath={location.pathname}/>
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  )
}
