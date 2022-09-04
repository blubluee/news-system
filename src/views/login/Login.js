import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import './Login.css'
import service from '../../api/request'

export default function Login() {
  const navigate = useNavigate()

  const onFinish = (values) => {
    // console.log('Success:', values)

    service.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      if (res.data.length === 0) {
        message.error('用户名或密码不匹配')
      } else {
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        navigate('/', {
          replace: true
        })
      }
    })

  }
  
  return (
    <div style={{ background: 'rgb(35, 39, 65)', height: '100%' }}>
      <div className="formContainer">
        <div className="logintitle">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
          <Form.Item style={{textAlign:'center'}}>
            <a href='/news'>游客系统</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
