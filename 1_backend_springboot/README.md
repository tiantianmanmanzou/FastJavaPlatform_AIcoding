# Java Backend Template

基于 Spring Boot 3.x 的极简通用后端脚手架，聚焦用户/角色/权限管理与 JWT 无状态认证，可与 `ProductDesign_ReactFramework` 前端模板即刻联调。模板内置统一响应、全局异常、RBAC、MyBatis Plus、SpringDoc 等能力，可作为企业后台项目的基础骨架继续扩展。

## 技术栈

- Java 17, Spring Boot 3.2
- Spring Security + JWT（JJWT 0.12）
- MyBatis Plus 3.5（分页、CRUD）
- MySQL 8.x 驱动
- Spring Validation、Lombok、Hutool
- SpringDoc OpenAPI 3（Swagger UI）

## 主要特性

- ✅ 用户/角色/权限模块 + RBAC 关系模型
- ✅ JWT 无状态认证过滤器、登录 / 刷新 / 信息接口
- ✅ 统一 Result/PageResult 响应格式，前端零改动接入
- ✅ 全局异常 & 业务异常(ErrorCode) 规范输出
- ✅ MyBatis Plus + 分页拦截器，XML 预留可扩展 SQL
- ✅ Swagger UI + JWT 安全配置，调试便捷
- ✅ CORS 跨域、分页查询、参数校验示例

## 项目结构

```
java-backend-template/
├── src/main/java/com/template
│   ├── TemplateApplication.java
│   ├── config/              # CORS / Security / MyBatisPlus / Swagger
│   ├── common/              # 常量、异常、统一响应
│   ├── security/            # JWT 工具、过滤器、处理器
│   ├── module/
│   │   ├── auth             # 认证控制器 & 服务
│   │   ├── user             # 用户 CRUD + DTO + Mapper
│   │   ├── role             # 角色、权限分配
│   │   └── permission       # 权限树、增删改查
│   └── util/                # 工具类
├── src/main/resources
│   ├── application.yml / application-*.yml
│   ├── mapper/*.xml         # 预留 SQL
│   └── db/schema.sql        # RBAC 数据表
└── pom.xml
```

## 快速开始

1. **环境准备**
   - JDK 17+
   - Maven 3.8+
   - MySQL 8.x（创建数据库 `java_backend_template`）

2. **初始化数据库**

   ```bash
   mysql -uroot -p java_backend_template < src/main/resources/db/schema.sql
   ```

3. **配置数据库**
   - 参考 `src/main/resources/application-dev.yml` 修改 `spring.datasource.*`

4. **启动项目**

   ```bash
   mvn spring-boot:run
   ```

5. **接口访问**
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - API Docs: `http://localhost:8080/v3/api-docs`

## 核心接口（节选）

| 模块 | 方法 | 路径 | 描述 |
| --- | --- | --- | --- |
| 认证 | POST | `/api/auth/login` | 登录并返回 JWT |
| 认证 | POST | `/api/auth/refresh` | 刷新 Token |
| 认证 | GET | `/api/auth/info` | 获取当前用户 |
| 用户 | GET | `/api/users` | 分页查询用户 |
| 用户 | POST | `/api/users` | 创建用户并绑定角色 |
| 用户 | PUT | `/api/users/{id}` | 更新用户信息 |
| 用户 | DELETE | `/api/users/{id}` | 删除用户 |
| 用户 | DELETE | `/api/users/batch` | 批量删除 |
| 角色 | GET | `/api/roles` | 角色分页 |
| 角色 | POST | `/api/roles/{id}/permissions` | 分配权限 |
| 权限 | GET | `/api/permissions/tree` | 权限树 |
| 权限 | POST | `/api/permissions` | 创建权限 |

> 完整接口、入参/出参说明可在 Swagger UI 中查看。

## 跨域 & 安全

- `CorsConfig` 提供默认 `localhost:5173/3000` 白名单；生产环境可通过 `application-*.yml` 中的 `cors.*` 配置覆盖。
- `SecurityConfig` 白名单：`/api/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`，其余接口需持有 `Authorization: Bearer <token>`。

## 扩展业务模块

1. 在 `module` 下新增业务目录（controller/service/mapper/entity/dto）。
2. 复用 `Result` / `PageResult` 统一响应。
3. 在 `sys_permission` 中增加对应权限，前端即可基于权限树渲染菜单 / 控制按钮。
4. 若需缓存、搜索等能力，可在模板上按需引入对应依赖。

## 前后端协作

- 响应格式固定 `code/message/data`，分页 `data.list/total/page/pageSize`。
- 错误统一由 `GlobalExceptionHandler` 输出，前端可直接根据 `code` 做处理。
- JWT 有效期默认 7 天，可在 `application.yml` 的 `jwt.expiration` 调整。

> 本模板聚焦通用 RBAC 能力，可作为 BFF/微服务集群的统一用户中心，也可以继续拆分模块构建更复杂的业务场景。
