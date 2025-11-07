import React, { useState } from 'react'
import { Card, Form, Input, Button, Typography, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../api/auth'
import { useAppDispatch } from '../../store/hooks'
import { setToken as setTokenAction, setUserInfo } from '../../store/slices/userSlice'
import { setToken as persistToken } from '../../utils/storage'
import type { LoginPayload } from '../../api/auth'
import './Login.scss'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/navigation'

  const handleFinish = async (values: LoginPayload) => {
    setLoading(true)
    try {
      const res = await login(values)
      const data = res.data
      persistToken(data.token)
      dispatch(setTokenAction(data.token))
      dispatch(setUserInfo(data.user))
      message.success('登录成功')
      navigate(from, { replace: true })
    } catch (error) {
      // 错误已在axios拦截器中处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <Typography.Title level={3} className="login-title">
          企业数据管理平台
        </Typography.Title>
        <Typography.Paragraph className="login-subtitle">
          请输入账号和密码继续
        </Typography.Paragraph>
        <Form size="large" layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="admin" allowClear />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Admin@123" allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
