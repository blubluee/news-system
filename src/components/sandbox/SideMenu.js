import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './index.css'

import service from '../../api/request'

const { Sider } = Layout

const iconList = {
  '/home': <UserOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <UserOutlined />,
  '/right-manage': <UserOutlined />,
  '/right-manage/role/list': <UserOutlined />,
  '/right-manage/right/list': <UserOutlined />,
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    const {
      role: { rights },
    } = JSON.parse(localStorage.getItem('token'))
    const checkPagePermission = (item) => {
      return item.pagepermisson && rights.includes(item.key)
    }
    let menus = []
    const formattedMenu = (menuList) => {
      menus = menuList.map((item) => {
        let menu = {}
        if (item.children?.length > 0 && checkPagePermission(item)) {
          menu.children = item.children
        }
        menu.pagepermisson = item.pagepermisson
        menu.label = item.title
        menu.key = item.key
        menu.icon = iconList[item.key]
        return menu
      })
    }
    const formattedMenuChildren = (menuList) => {
      menuList = menuList.filter((item) => item.pagepermisson !== undefined)
  
      return menuList.map((item) => {
        let menu = {}
        menu.label = item.title
        menu.key = item.key
        menu.icon = iconList[item.key]
        return menu
      })
    }

    service.get('/rights?_embed=children').then((res) => {
      formattedMenu(res.data)
      menus = menus.filter((item) => item.pagepermisson === 1)
      menus.map((item) => {
        if (item.children?.length > 0) {
          item.children = formattedMenuChildren(item.children)
        }
        return null
      })
      menus = menus.filter(item => item.children !== undefined || item.key==='/home')
      setMenu(menus)
    })
  }, [])

  const navigate = useNavigate()
  function goto(item) {
    navigate(item.key)
  }

  const location = useLocation()
  const [path, setPath] = useState(location.pathname)
  const [openKeys, setOpenKeys] = useState('/' + location.pathname.split('/')[1])
  const { currentPath } = props
  useEffect(() => {
    setOpenKeys('/' + currentPath.split('/')[1])
    setPath(currentPath)
  }, [currentPath])
  

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo">全球新闻发布中心</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={path}
            openKeys={[openKeys]}
            items={menu}
            onClick={goto}
            onOpenChange={(openKeys) => {setOpenKeys(openKeys[1])}}
            onSelect={({key}) => {setPath(key)}}
          />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => ({
  isCollapsed
})

export default connect(mapStateToProps)(SideMenu)