import React from 'react'
import { connect } from 'react-redux';
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout

function TopHeader (props) {
  const navigate = useNavigate()
  const onClick = ({ key }) => {
    // console.log(key);
    if (key === 'logout') {
      navigate('login', {
        replace: false
      })
      localStorage.removeItem('token')
    }
  }
  const changeCollapsed = () => {
    return props.changeCollapsed()
  }

  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))

  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          key: '1',
          label: (<>{roleName}</>),
        },
        {
          key: 'logout',
          danger: true,
          label: 'Logout',
        },
      ]}
    />
  );

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined className={'trigger'} onClick={changeCollapsed} /> :
          <MenuFoldOutlined className={'trigger'} onClick={changeCollapsed} />
      }
      <div style={{ float: 'right' }}>
        <span>欢迎 <span style={{color:"#1890ff"}}>{username}</span> 回来</span>
        <Dropdown overlay={menu}>
          <Avatar size={46} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ CollapsedReducer: {isCollapsed}}) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed'
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)