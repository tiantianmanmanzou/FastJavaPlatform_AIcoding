您调用方舟平台的模型之前，您需要 API Key 来进行鉴权。同时因为 API Key 信息较为敏感，泄露 API Key 会导致您的模型用量被其他人花费，造成一定的损失，因此我们会给出配置 API Key 进环境变量的方法，方便您合理安全地使用API Key。

## 获取 API Key

1.  打开并登录[API Key 管理](https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey) 页面。
2.  （可选）单击左上角 **账号全部资源** 下拉箭头，切换项目空间。
3.  单击 **创建 API Key** 按钮。
4.  在弹出框的 **名称** 文本框中确认/更改 API Key名称，单击创建。

您可以在[API Key 管理](https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey) 页面的 **API Key 列表**中查看刚创建的API Key信息。

## 配置 API Key

推荐将 API Key 配置在环境变量中，而不是硬编码进代码中，避免 API Key 随代码泄露，导致配额被他人使用，产生额外花费。  
配置方法见：[配置 API Key 到环境变量](https://www.volcengine.com/docs/82379/1399008#4b62407d)。

## API 使用说明

- API Key 配额：一个主账号下支持创建 50 个API Key，如需更多配额请提交[工单](https://console.volcengine.com/workorder/create?step=2&SubProductID=P00001166)申请。
- API Key 权限控制：API Key 创建于您当前所在项目，用于访问当前项目下的资源。您可为 API Key 额外限制可鉴权的推理接入点，或可调用该 API Key 的 IP。
  - TIPS ：您切换项目空间创建 API Key，可限制 API Key 只用于指定项目空间下的模型服务的鉴权凭证。当您的账号是多人使用，可以通过此方法进行权限隔离。
  - 注意：API Key 仅支持访问指定项目下的接入点，不支持跨项目访问。当您跨项目迁移了接入点，则原 API Key 鉴权将失效。
