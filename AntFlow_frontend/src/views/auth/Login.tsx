import React, { useState } from 'react'
import { Card, Form, Input, Button, Typography } from '@ui'
import { LockOutlined, UserOutlined } from '@ui/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../api/auth'
import { useAppDispatch } from '../../store/hooks'
import { setToken as setTokenAction, setUserInfo } from '../../store/slices/userSlice'
import { setToken as persistToken } from '../../utils/storage'
import type { LoginPayload } from '../../api/auth'
import platformLogo from '../../assets/platform-logo.png'
import './Login.scss'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm({})
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
      navigate(from, { replace: true })
    } catch (error) {
      // 错误已在axios拦截器中处理
    } finally {
      setLoading(false)
    }
  }

  // 点击 logo 快速登录
  const handleLogoClick = () => {
    // 直接调用登录函数，不依赖表单验证
    handleFinish({
      username: 'admin',
      password: 'Admin@123'
    })
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-hero">
          <img src={platformLogo} alt="平台Logo" className="login-logo" />
          <span className="login-badge">AntFlow 2.0</span>
          <h1>以体验驱动数据管理</h1>
          <p>统一的身份、权限与数据治理平台，让业务协作、流程审批与数据洞察一体化。</p>
          <div className="login-stats">
            <div>
              <strong>128+</strong>
              <span>企业项目落地</span>
            </div>
            <div>
              <strong>3,500+</strong>
              <span>日常活跃用户</span>
            </div>
            <div>
              <strong>99.9%</strong>
              <span>服务可用性</span>
            </div>
          </div>
        </div>
        <Card className="login-card">
          <img
            src={platformLogo}
            alt="平台Logo"
            className="login-logo centered clickable"
            onClick={handleLogoClick}
            title="点击快速登录"
          />
          <Typography.Title level={3} className="login-title">
            溢流内容管理平台
          </Typography.Title>
          <Typography.Paragraph className="login-subtitle">
            请输入账号和密码继续
          </Typography.Paragraph>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="login-form"
          >
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
    </div>
  )
}

export default Login
