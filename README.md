# FastJavaPlatform_AIcoding

[![React](https://img.shields.io/badge/React-19.1-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-red?logo=openjdk)](https://www.java.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Latest-blue?logo=docker)](https://www.docker.com)

AI辅助快速搭建Java全栈项目的开发平台，提供完整的前后端模板、组件库、权限系统和一键部署方案。

## 核心特性

- **🚀 开箱即用** - 前端11个通用组件 + 8种布局模板，后端完整RBAC权限系统，无需重复造轮子
- **⚡ 一键部署** - Docker容器化数据库 + 智能启动脚本，自动处理依赖、端口和进程管理
- **🛠️ 现代技术栈** - React 19 + Spring Boot 3 + JWT认证 + MyBatis Plus + Vite 7
- **📐 标准化架构** - 前后端分离 + RESTful API + Swagger文档 + 统一响应格式

## 项目架构

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   React 前端    │         │  Spring Boot     │         │   MySQL 8.0  │
│  (5173)         │◄───────►│  后端 (8080)     │◄───────►│  (Docker)    │
│                 │  HTTP   │                  │   JDBC  │              │
│ • Redux 状态管理 │         │ • JWT 认证       │         │ • RBAC权限   │
│ • Ant Design   │         │ • MyBatis Plus  │         │ • 5张核心表  │
│ • 11个组件库   │         │ • Swagger API   │         │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

## 技术栈

### 前端
- **React 19.1** + TypeScript 5.x
- **Redux Toolkit** 状态管理
- **Ant Design 5.26** UI组件库
- **Vite 7.0** 极速构建
- **Axios** HTTP客户端
- **React Router 7.6** 路由管理

### 后端
- **Spring Boot 3.2** (Java 17)
- **Spring Security** + JWT 无状态认证
- **MyBatis Plus 3.5** ORM框架
- **Swagger/OpenAPI 3** 自动文档
- **Spring Validation** 参数校验
- **Hutool 5.8** 工具库

### 数据库
- **MySQL 8.0** 关系型数据库
- **RBAC权限模型**（5张核心表）
- **Docker Compose** 容器化部署

## 快速开始

### 前提条件
- Git
- Node.js 18+ 和 npm
- Java 17+
- Docker & Docker Compose

### 启动步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd FastJavaPlatform_AIcoding

# 2. 一键启动（自动启动Docker数据库、后端、前端）
cd 3_deploy/local
./start_local_stack.sh

# 3. 访问系统
# 前端：http://localhost:5173
# 后端API：http://localhost:8080
# Swagger文档：http://localhost:8080/swagger-ui.html

# 默认账号
# 用户名：admin
# 密码：Admin@123
```

### 手动启动（如需分别启动）

```bash
# 终端1：启动数据库
cd 3_deploy/local
docker-compose up -d

# 终端2：启动后端
cd 1_backend_springboot
mvn spring-boot:run

# 终端3：启动前端
cd 0_frontend_react
npm install
npm run dev
```

## 项目结构

```
FastJavaPlatform_AIcoding/
├── 0_frontend_react/          # React前端项目（52个TS/TSX文件）
│   ├── src/
│   │   ├── components/        # 11个通用组件 + 8种布局模板
│   │   ├── views/             # 业务页面（用户/角色/权限/日志管理）
│   │   ├── store/             # Redux状态管理
│   │   ├── api/               # API接口层
│   │   └── types/             # TypeScript类型定义
│   └── package.json
│
├── 1_backend_springboot/      # Spring Boot后端项目（60个Java文件）
│   ├── src/main/
│   │   ├── java/com/template/
│   │   │   ├── config/        # Spring配置（Security/Cors/MyBatis/Swagger）
│   │   │   ├── security/      # JWT认证和授权
│   │   │   ├── module/        # 业务模块（auth/user/role/permission）
│   │   │   ├── common/        # 通用类（异常处理、响应格式）
│   │   │   └── util/          # 工具类
│   │   └── resources/
│   │       ├── application.yml          # 主配置
│   │       ├── application-dev.yml      # 开发环境
│   │       └── db/schema.sql            # 数据库初始化脚本
│   └── pom.xml
│
├── 3_deploy/
│   └── local/
│       ├── docker-compose.yml  # MySQL容器配置
│       ├── start_local_stack.sh # 一键启动脚本
│       └── data/               # 数据库持久化目录
│
└── 文档/                      # 部署指南和开发文档
    └── 用户管理系统-部署指南.md
```

## 内置功能

### 权限管理系统
- ✅ **用户管理** - 用户CRUD、状态管理、部门管理
- ✅ **角色管理** - 角色创建、权限分配、批量操作
- ✅ **权限管理** - 菜单权限、按钮权限、接口权限、树形结构
- ✅ **认证授权** - JWT Token（7天有效期）、无状态会话、权限验证

### UI组件库（11个通用组件）
- DataTable（数据表格）
- FilterBar（筛选栏）
- SearchBar（搜索栏）
- Pagination（分页）
- DialogWrapper（弹窗）
- PageHeader（页面标题）
- ActionButton（操作按钮）
- Tabs（标签页）
- TreeNode（树形节点）
- VerticalIconMenu（垂直菜单）
- FilterFields（筛选字段）

### 布局模板（8种）
- NavigationLayout（侧边栏导航）
- TablePageLayout（表格页面）
- FilterBarTablePageLayout（筛选表格页面）
- HorizontalTabsPageLayout（横向标签页）
- VerticalTabsPageLayout（纵向标签页）
- BlankLayout（空白布局）

## 适用场景

- 企业级管理系统开发
- 中后台管理平台快速搭建
- SaaS系统和互联网应用原型
- 权限管理系统参考实现
- 快速MVP验证和迭代

## API示例

```bash
# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# 获取用户列表（需要Authorization header）
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <token>"

# 查看完整API文档
# 访问：http://localhost:8080/swagger-ui.html
```

## 常见问题

### 端口被占用
```bash
# 如果3306/8080/5173端口被占用，启动脚本会自动清理
# 或手动清理：
lsof -ti:8080 | xargs kill -9
```

### 数据库连接失败
```bash
# 检查Docker是否运行
docker ps

# 检查MySQL容器日志
docker logs java-template-mysql
```

### 前端无法访问后端
- 确保后端已启动：http://localhost:8080/swagger-ui.html
- 检查 `.env.development` 文件中的API地址配置

## 详细文档

- [前端开发指南](0_frontend_react/README.md)
- [后端开发指南](1_backend_springboot/README.md)
- [完整部署指南](文档/用户管理系统-部署指南.md)

## 开发建议

1. **前端开发**：基于内置的11个组件和8种布局模板快速开发页面
2. **后端开发**：参考现有模块结构（auth/user/role/permission）开发新功能
3. **数据库**：使用MyBatis Plus和SQL脚本管理数据库版本
4. **API文档**：自动生成Swagger文档，访问 `/swagger-ui.html` 查看

## 许可证

MIT
