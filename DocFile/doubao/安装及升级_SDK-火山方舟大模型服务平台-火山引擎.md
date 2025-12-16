方舟提供了 Python 、 Go 和 Java 的 SDK ，方便使用对应编程语言快速调用方舟的模型服务。

Python SDK

## 前提条件

本地已经安装了Python ，且版本不低于 3.7。

> 可在终端中通过命令确认 Python 版本。如需安装，参考[Python安装教程](https://wiki.python.org/moin/BeginnersGuide/Download)，注意选择3.7及以上版本。

```bash
python -V
```

## 安装 Python SDK

在终端中执行命令安装 Python SDK。

```bash
pip install 'volcengine-python-sdk[ark]'
```

说明

- 如本地安装错误，可尝试下面方法：
  - [Windows系统安装SDK失败，ERROR: Failed building wheel for volcengine-python-sdk](https://www.volcengine.com/docs/82379/1359411#b74e8ad6)
  - 尝试使用下面命令`pip install volcengine-python-sdk[ark]`
- 如需源码安装，可下载&解压对应版本 SDK 包，进入目录执行命令：`python setup.py install --user`。

## 升级 Python SDK

如需使用方舟提供的最新能力，请升级 SDK 至最新版本。

```bash
pip install 'volcengine-python-sdk[ark]' -U
```

Go SDK

## 前提条件

检查 Go 版本，需 1.18 或以上。

```bash
go version
```

如未安装或版本不满足，可访问 [Go 语言官方网站](https://golang.google.cn/dl/)下载并安装，请选择 1.18 或以上版本。

## 安装 Go SDK

1.  Go SDK 使用 go mod 管理，可运行以下命令初始化 go mod。`<your-project-name>` 替换为项目名称。

```bash
# 如在文件夹 ark-demo 下打开终端窗口，运行命令go mod init ark-demo
go mod init <your-project-name>
```

2.  在本地初始化 go mod 后，运行以下命令安装最新版 SDK。

```bash
go get -u github.com/volcengine/volcengine-go-sdk
```

说明

如需安装特定版本的SDK，可使用命令：  
`go get -u github.com/volcengine/volcengine-go-sdk@<VERSION>`  
其中`<VERSION>`替换为版本号。SDK 版本可查询： https://github.com/volcengine/volcengine-go-sdk/releases

3.  在代码中引入 SDK 使用。

```go
import "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
```

4.  更新依赖后，使用命令整理依赖。

```bash
go mod tidy
```

## 升级 Go SDK

步骤与安装 Go SDK相同，可参考[安装 Go SDK](https://www.volcengine.com/docs/82379/1541595#ae8b42ab)，第1，2步升级至最新/指定版本SDK。

- 升级至最新版本

```bash
go get -u github.com/volcengine/volcengine-go-sdk
```

- 升级至指定版本

```bash
go get -u github.com/volcengine/volcengine-go-sdk@<VERSION>
```

Java SDK

## 适用范围

本 SDK 仅适用于 Java 服务端开发，暂不支持 Android 平台。若需在 Android 平台使用相关功能，需由客户自行开发适配方案。

## 前提条件

1.  检查并安装 Java 版本，Java 版本需 1.8 或以上。

```bash
java -version
```

如未安装 Java 或者版本不满足要求，可访问 [Oracle 官方网站](https://www.java.com/en/download/help/index_installing.html)下载并安装适合操作系统的 Java 版本。请确保选择 1.8 或以上版本。

## 安装 Java SDK

火山方舟 Java SDK 支持通过 Maven 安装、通过 Gradle 安装两种方式。

### 通过 Maven 安装

在 `pom.xml` 文件中进行如下配置，完整配置可参考[Maven Central](https://central.sonatype.com/artifact/com.volcengine/volcengine-java-sdk-ark-runtime)：

```xml
...
<dependency>
  <groupId>com.volcengine</groupId>
  <artifactId>volcengine-java-sdk-ark-runtime</artifactId>
  <version>LATEST</version>
</dependency>
...
```

### 通过 Gradle 安装

在 `build.gradle` 文件中进行如下配置，在 `dependencies` 中添加依赖。

```
implementation 'com.volcengine:volcengine-java-sdk-ark-runtime:LATEST'
```

## 升级 Java SDK

同安装 Java SDK，指定需升级的版本号即可。

第三方SDK

火山方舟模型调用 API 与 OpenAI API 协议兼容，可使用兼容 OpenAI API 协议的多语言社区 SDK 调用火山方舟大模型或应用。可很方便地迁移模型服务至方舟平台以及 Doubao 大模型。具体使用方法请参考[兼容 OpenAI SDK](https://www.volcengine.com/docs/82379/1330626)。

相关文档

[SDK 常见使用示例](https://www.volcengine.com/docs/82379/1544136)：包含SDK的常见用法。
