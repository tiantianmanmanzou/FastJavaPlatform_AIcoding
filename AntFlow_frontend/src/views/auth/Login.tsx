import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import { login } from '../../api/auth'
import { useAppDispatch } from '../../store/hooks'
import { setToken as setTokenAction, setUserInfo } from '../../store/slices/userSlice'
import { setToken as persistToken } from '../../utils/storage'
import type { LoginPayload } from '../../api/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import platformLogo from '../../assets/platform-logo.png'
import './Login.scss'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<LoginPayload>({ username: '', password: '' })
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/content-creation'

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: { username?: string; password?: string } = {}
    if (!formValues.username) nextErrors.username = '请输入用户名'
    if (!formValues.password) nextErrors.password = '请输入密码'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      void handleFinish(formValues)
    }
  }

  const handleLogoClick = () => {
    setFormValues({ username: 'admin', password: 'Admin@123' })
    void handleFinish({
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
          <CardContent className="login-card__content">
            <img
              src={platformLogo}
              alt="平台Logo"
              className="login-logo centered clickable"
              onClick={handleLogoClick}
              title="点击快速登录"
            />
            <div className="login-card__title">
              <h3>溢流内容管理平台</h3>
              <p>请输入账号和密码继续</p>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form-field">
                <Label htmlFor="username">用户名</Label>
                <div className="login-input-wrapper">
                  <User className="login-input-icon" size={18} />
                  <Input
                    id="username"
                    placeholder="admin"
                    value={formValues.username}
                    className="login-input"
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, username: event.target.value }))
                    }
                  />
                </div>
                {errors.username && <span className="login-error">{errors.username}</span>}
              </div>
              <div className="login-form-field">
                <Label htmlFor="password">密码</Label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Admin@123"
                    value={formValues.password}
                    className="login-input"
                    onChange={(event) =>
                      setFormValues((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                </div>
                {errors.password && <span className="login-error">{errors.password}</span>}
              </div>
              <Button type="submit" className="login-submit" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
