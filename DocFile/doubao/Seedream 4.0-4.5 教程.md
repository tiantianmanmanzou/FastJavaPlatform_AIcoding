Seedream 4.0-4.5 原生支持文本、单图和多图输入，实现基于主体一致性的多图融合创作、图像编辑、组图生成等多样玩法，让图像创作更加自由可控。本文以 Seedream 4.5 为例介绍如何调用 <a href="https://www.volcengine.com/docs/82379/1541523">Image generation API</a> 进行图像创作。如需使用 Seedream 4.0 模型，将下文代码示例中的 model 字段替换为`doubao-seedream-4-0-250828`即可。 
<span id="2cf5cace"></span>
# 模型效果
更多效果示例见 [效果预览](https://console.volcengine.com/ark/region:ark+cn-beijing/model/detail?Id=doubao-seedream-4-5)。

---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);">

场景


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

输入


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

输出


</div>
</div>


<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3348576323987539);">

多参考图生图
> 输入多张参考图，融合它们的风格、元素等特征来生成新图像。






</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3317423676012461);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/2198d4bef000400bbfea18025850ed82~tplv-goo7wpa0wc-image.image" width="930px" /></div>

> 将图1的服装换为图2的服装


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/461d4bf2a014454fbeda72f27d706ffe~tplv-goo7wpa0wc-image.image" width="1280px" /></div>




</div>
</div>


---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3311535974600903);">

组图生成
> 基于用户输入的文字和图片，生成一组内容关联的图像




</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3320553846383162);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/a215e8241dd94f50901948790da121e1~tplv-goo7wpa0wc-image.image" width="930px" /></div>

> 参考图1，生成四图片，图中人物分别带着墨镜，骑着摩托，带着帽子，拿着棒棒糖


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3366910179015934);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/98c9e2c30dbb425aa25380c821e289ca~tplv-goo7wpa0wc-image.image" width="1200px" /></div>




</div>
</div>

<span id="9278b81b"></span>
# 模型选择

* Seedream 4.5 作为字节跳动最新的图像生成模型，能力最强，在编辑一致性（如主体细节与光影色调的保持）、人像美化和小字生成方面体验升级。同时，模型的多图组合能力显著增强，推理能力与画面美学持续优化，能够更精准、更具艺术感地呈现创意。
* Seedream 4.0 图像生成模型，适用于平衡预算与图片输出质量的场景，能满足一般性的图像生成需求。


| | | | | | | \
|**模型名称** |\
|<div style="width:150px"></div> |**版本** |\
| |<div style="width:150px"></div> |**模型 ID（Model ID）** |\
| | |<div style="width:150px"></div> |**模型能力** |\
| | | |<div style="width:200px"></div> |**限流 IPM** |\
| | | | |> 每分钟生成图片数量上限（张 / 分钟） |\
| | | | | |\
| | | | |<div style="width:150px"></div> |**定价** |\
| | | | | |<div style="width:150px"></div> |
|---|---|---|---|---|---|
| | | | | | | \
|[doubao-seedream-4.5](https://console.volcengine.com/ark/region:ark+cn-beijing/model/detail?Id=doubao-seedream-4-5)  |251128`强烈推荐` |doubao-seedream-4-5-251128 |* 文生图 |\
| | | |* 图生图：单张图生图、多参考图生图 |\
| | | |* 生成组图：文生组图、单张图生组图、多参考图生组图 |500 |[图片生成模型](/docs/82379/1544106#5e813e2f) |
| | | |^^| | | \
|[doubao-seedream-4.0](/docs/82379/1824718) |250828`推荐` |doubao-seedream-4-0-250828 | |500 |[图片生成模型](/docs/82379/1544106#5e813e2f) |




<span id="88612aa1"></span>
# 前提条件

* [获取 API Key](https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey) 。
* [开通模型服务](https://console.volcengine.com/ark/region:ark+cn-beijing/openManagement?LLM=%7B%7D&OpenTokenDrawer=false)。
* 在[模型列表](/docs/82379/1330310)获取所需 Model ID 。
   * 通过 Endpoint ID 调用模型服务请参考[获取 Endpoint ID（创建自定义推理接入点）](/docs/82379/1099522)。


<span id="386b6ea2"></span>
# 快速体验
您可在火山方舟平台 <a href="https://api.volcengine.com/api-explorer/?action=ImageGenerations&groupName=%E5%9B%BE%E7%89%87%E7%94%9F%E6%88%90API&serviceCode=ark&tab=2&version=2024-01-01#N4IgTgpgzgDg9gOyhA+gMzmAtgQwC4gBcIArmADYgA0IUAlgF4REgBMA0tSAO74TY4wAayJoc5ZDSxwAJhErEZcEgCMccALTIIMyDiwaALBoAMG1gFYTADlbWuMMHCwwCxQPhmgUTTA-l6Ao2MAw-4CLeYB4tkHBgDOJgE2KgF+KgABygGHxgNf6gPSmgN2egCwegHEegCFugLCagCfKgOhKgGbx-oBFRoBjkYCTkZGA34qA2Ur+gKyugI76gOSagOJO-oDU5oCnpoBHphWA+Ib+gBVKI4Cf2oAr1oBOQf5wAMaATHaAy+b+gJKKgP1+gL-xgFRxY4CABoCEVoBTPv6A9maAj7b+gKGxgA3OgHnagNxygJJy-peAuyH+gNyugEbpgFgJgHH4wBjfoBvQOygAY5QAz2tkZoBLfUAQjqAQmtAIoagAIEp6AZXlAHBygC51c7+QAUsUNAPjuD38gHSzQKAOYzADMB52y6xagAlTQA55oBSELR0UA2DaAF7V-IAXU0xgB9FQDuioAvIMA9OaAbz1AM8GI0AHJqAAn1soB-PUAS5GAeASKmz-IAAAPW-kAs8qAEB1-IBA80AL4GMlr+QBc+oBUfUagDwVQA2aiAAL5AA">API Explorer</a>，快速体验图片生成功能，支持自定义参数（例如设置图片水印、控制输出图片大小等），方便您直观感受其效果和性能。
![Image](https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/4d9946df9dfe4011af999c694f9545fe~tplv-goo7wpa0wc-image.image =100%x)

<span id="e36d7d78"></span>
# 基础使用
<span id="9695d195"></span>
## 文生图（纯文本输入单图输出）
通过给模型提供清晰准确的文字指令，即可快速获得符合描述的高质量单张图片。 

---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.6671732522796352);">

提示词


</div>
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.33282674772036475);margin-left: 16px;">

输出


</div>
</div>


<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.6656534954407295);">

充满活力的特写编辑肖像，模特眼神犀利，头戴雕塑感帽子，色彩拼接丰富，眼部焦点锐利，景深较浅，具有Vogue杂志封面的美学风格，采用中画幅拍摄，工作室灯光效果强烈。



</div>
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.3343465045592705);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/00fb66006eb84b16965b620b6e1f2d78~tplv-goo7wpa0wc-image.image" width="1280px" /></div>



</div>
</div>


```mixin-react
return (<Tabs>
<Tabs.TabPane title="Curl" key="hgh3pdSlav"><RenderMd content={`\`\`\`Plain Text
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ARK_API_KEY" \\
  -d '{
    "model": "doubao-seedream-4-5-251128",
    "prompt": "充满活力的特写编辑肖像，模特眼神犀利，头戴雕塑感帽子，色彩拼接丰富，眼部焦点锐利，景深较浅，具有Vogue杂志封面的美学风格，采用中画幅拍摄，工作室灯光效果强烈。",
    "size": "2K",
    "watermark": false
}'
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python" key="Ngr6CASoIX"><RenderMd content={`\`\`\`Python
import os
# Install SDK:  pip install 'volcengine-python-sdk[ark]' .
from volcenginesdkarkruntime import Ark 

client = Ark(
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
)
 
imagesResponse = client.images.generate( 
    # Replace with Model ID
    model="doubao-seedream-4-5-251128",
    prompt="充满活力的特写编辑肖像，模特眼神犀利，头戴雕塑感帽子，色彩拼接丰富，眼部焦点锐利，景深较浅，具有Vogue杂志封面的美学风格，采用中画幅拍摄，工作室灯光效果强烈。",
    size="2K",
    response_format="url",
    watermark=False
) 
 
print(imagesResponse.data[0].url)
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="Vni9MBBBu0"><RenderMd content={`\`\`\`Java
package com.ark.sample;


import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.Arrays; 
import java.util.List; 
import java.util.concurrent.TimeUnit;

public class ImageGenerationsExample { 
    public static void main(String[] args) {
        // Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
        String apiKey = System.getenv("ARK_API_KEY");
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();
        ArkService service = ArkService.builder()
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
                .dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .apiKey(apiKey)
                .build();
                
        GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
                .model("doubao-seedream-4-5-251128") // Replace with Model ID
                .prompt("充满活力的特写编辑肖像，模特眼神犀利，头戴雕塑感帽子，色彩拼接丰富，眼部焦点锐利，景深较浅，具有Vogue杂志封面的美学风格，采用中画幅拍摄，工作室灯光效果强烈。")
                .size("2K")
                .sequentialImageGeneration("disabled")
                .responseFormat(ResponseFormat.Url)
                .stream(false)
                .watermark(false)
                .build();
        ImagesResponse imagesResponse = service.generateImages(generateRequest);
        System.out.println(imagesResponse.getData().get(0).getUrl());

        service.shutdownExecutor();
    }
}
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Go" key="LUwaajAQjC"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "fmt"
    "os"
    "strings"
    
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
    "github.com/volcengine/volcengine-go-sdk/volcengine"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        // Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
        os.Getenv("ARK_API_KEY"),
        // The base URL for model invocation
        arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
    )    
    ctx := context.Background()

    generateReq := model.GenerateImagesRequest{
       Model:          "doubao-seedream-4-5-251128", // Replace with Model ID
       Prompt:         "充满活力的特写编辑肖像，模特眼神犀利，头戴雕塑感帽子，色彩拼接丰富，眼部焦点锐利，景深较浅，具有Vogue杂志封面的美学风格，采用中画幅拍摄，工作室灯光效果强烈。",
       Size:           volcengine.String("2K"),
       ResponseFormat: volcengine.String(model.GenerateImagesResponseFormatURL),
       Watermark:      volcengine.Bool(false),
    }

    imagesResponse, err := client.GenerateImages(ctx, generateReq)
    if err != nil {
       fmt.Printf("generate images error: %v\\n", err)
       return
    }

    fmt.Printf("%s\\n", *imagesResponse.Data[0].Url)
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="OpenAI" key="oFZpToAPj8"><RenderMd content={`\`\`\`Python
import os
from openai import OpenAI

client = OpenAI( 
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    # Replace with Model ID
    model="doubao-seedream-4-5-251128",
    prompt="充满活力的特写编辑肖像，模特眼神犀利，头戴雕塑感帽子，色彩拼接丰富，眼部焦点锐利，景深较浅，具有Vogue杂志封面的美学风格，采用中画幅拍摄，工作室灯光效果强烈。",
    size="2K",
    response_format="url",
    extra_body={
        "watermark": false,
    },
) 
 
print(imagesResponse.data[0].url)

\`\`\`

`}></RenderMd></Tabs.TabPane></Tabs>);
 ```

<span id="8bc49063"></span>
## 图文生图（单图输入单图输出）
基于已有图片，结合文字指令进行图像编辑，包括图像元素增删、风格转化、材质替换、色调迁移、改变背景/视角/尺寸等。

---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);">

提示词


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

输入图


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

输出


</div>
</div>


<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3344961722488038);">

保持模特姿势和液态服装的流动形状不变。将服装材质从银色金属改为完全透明的清水（或玻璃）。透过液态水流，可以看到模特的皮肤细节。光影从反射变为折射。



</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3321038277511962);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/816153e67d3c4478886276154d78b22e~tplv-goo7wpa0wc-image.image" width="930px" /></div>




</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/0829972712544f95917464b15723b189~tplv-goo7wpa0wc-image.image" width="1280px" /></div>




</div>
</div>


```mixin-react
return (<Tabs>
<Tabs.TabPane title="Curl" key="tyAjMjuh78"><RenderMd content={`\`\`\`Plain Text
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ARK_API_KEY" \\
  -d '{
    "model": "doubao-seedream-4-5-251128",
    "prompt": "保持模特姿势和液态服装的流动形状不变。将服装材质从银色金属改为完全透明的清水（或玻璃）。透过液态水流，可以看到模特的皮肤细节。光影从反射变为折射。",
    "image": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imageToimage.png",
    "size": "2K",
    "watermark": false
}'
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python" key="dCo3rHedBQ"><RenderMd content={`\`\`\`Python
import os
# Install SDK:  pip install 'volcengine-python-sdk[ark]'
from volcenginesdkarkruntime import Ark 

client = Ark(
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
)
 
imagesResponse = client.images.generate( 
    # Replace with Model ID
    model="doubao-seedream-4-5-251128", 
    prompt="保持模特姿势和液态服装的流动形状不变。将服装材质从银色金属改为完全透明的清水（或玻璃）。透过液态水流，可以看到模特的皮肤细节。光影从反射变为折射。",
    image="https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imageToimage.png",
    size="2K",
    response_format="url",
    watermark=False
) 
 
print(imagesResponse.data[0].url)
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="Ih2CAWICob"><RenderMd content={`\`\`\`Java
package com.ark.sample;


import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.Arrays; 
import java.util.List; 
import java.util.concurrent.TimeUnit;

public class ImageGenerationsExample { 
    public static void main(String[] args) {
        String apiKey = System.getenv("ARK_API_KEY");
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();
        ArkService service = ArkService.builder()
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
                .dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .apiKey(apiKey)
                .build();

        GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
                .model("doubao-seedream-4-5-251128") // Replace with Model ID
                .prompt("保持模特姿势和液态服装的流动形状不变。将服装材质从银色金属改为完全透明的清水（或玻璃）。透过液态水流，可以看到模特的皮肤细节。光影从反射变为折射。")
                .image("https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imageToimage.png")
                .size("2K")
                .sequentialImageGeneration("disabled")
                .responseFormat(ResponseFormat.Url)
                .stream(false)
                .watermark(false)
                .build();
                
        ImagesResponse imagesResponse = service.generateImages(generateRequest);
        System.out.println(imagesResponse.getData().get(0).getUrl());

        service.shutdownExecutor();
    }
}
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Go" key="gW9ESQCq7H"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "fmt"
    "os"
    "strings"
    
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
    "github.com/volcengine/volcengine-go-sdk/volcengine"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        os.Getenv("ARK_API_KEY"),
        // The base URL for model invocation
        arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
    )    
    ctx := context.Background()

    generateReq := model.GenerateImagesRequest{
       Model:          "doubao-seedream-4-5-251128",
       Prompt:         "保持模特姿势和液态服装的流动形状不变。将服装材质从银色金属改为完全透明的清水（或玻璃）。透过液态水流，可以看到模特的皮肤细节。光影从反射变为折射。",
       Image:          volcengine.String("https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imageToimage.png"),
       Size:           volcengine.String("2K"),
       ResponseFormat: volcengine.String(model.GenerateImagesResponseFormatURL),
       Watermark:      volcengine.Bool(false),
    }

    imagesResponse, err := client.GenerateImages(ctx, generateReq)
    if err != nil {
       fmt.Printf("generate images error: %v\\n", err)
       return
    }

    fmt.Printf("%s\\n", *imagesResponse.Data[0].Url)
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="OpenAI" key="tfQqkPaZgx"><RenderMd content={`\`\`\`Python
import os
from openai import OpenAI

client = OpenAI( 
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 

imagesResponse = client.images.generate( 
    model="doubao-seedream-4-5-251128",
    prompt="保持模特姿势和液态服装的流动形状不变。将服装材质从银色金属改为完全透明的清水（或玻璃）。透过液态水流，可以看到模特的皮肤细节。光影从反射变为折射。",
    size="2K",
    response_format="url",
    extra_body = {
        "image": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imageToimage.png",
        "watermark": false
    }
) 

print(imagesResponse.data[0].url)
\`\`\`

`}></RenderMd></Tabs.TabPane></Tabs>);
 ```


<span id="4a35e28f"></span>
## 多图融合（多图输入单图输出）
根据您输入的文本描述和多张参考图片，融合它们的风格、元素等特征来生成新图像。如衣裤鞋帽与模特图融合成穿搭图，人物与风景融合为人物风景图等。

---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.19634146341463415);">

提示词


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.2658536585365853);margin-left: 16px;">

输入图1


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.2695121951219512);margin-left: 16px;">

输入图2


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.2682926829268293);margin-left: 16px;">

输出


</div>
</div>


<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.1951219512195122);">

将图1的服装换为图2的服装



</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.2695121951219512);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/4b4464161cf3463db6f9463b10939178~tplv-goo7wpa0wc-image.image" width="1024px" /></div>



</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.26707317073170733);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/c23d1b0528a14cb08b684307eabdcc9b~tplv-goo7wpa0wc-image.image" width="2046px" /></div>



</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.2682926829268293);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/461d4bf2a014454fbeda72f27d706ffe~tplv-goo7wpa0wc-image.image" width="1280px" /></div>



</div>
</div>


```mixin-react
return (<Tabs>
<Tabs.TabPane title="Curl" key="EVOlxIvs7r"><RenderMd content={`\`\`\`Plain Text
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ARK_API_KEY" \\
  -d '{
    "model": "doubao-seedream-4-5-251128",
    "prompt": "将图1的服装换为图2的服装",
    "image": ["https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png", "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imagesToimage_2.png"],
    "sequential_image_generation": "disabled",
    "size": "2K",
    "watermark": false
}'
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python" key="iYiOlrAlnz"><RenderMd content={`\`\`\`Python
import os
# Install SDK:  pip install 'volcengine-python-sdk[ark]'
from volcenginesdkarkruntime import Ark 

client = Ark(
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
imagesResponse = client.images.generate( 
    # Replace with Model ID
    model="doubao-seedream-4-5-251128",
    prompt="将图1的服装换为图2的服装",
    image=["https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png", "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imagesToimage_2.png"],
    size="2K",
    sequential_image_generation="disabled",
    response_format="url",
    watermark=False
) 
 
print(imagesResponse.data[0].url)
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="NwIhmbVDI4"><RenderMd content={`\`\`\`Java
package com.ark.sample;


import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.Arrays; 
import java.util.List; 
import java.util.concurrent.TimeUnit;

public class ImageGenerationsExample { 
    public static void main(String[] args) {
        String apiKey = System.getenv("ARK_API_KEY");
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();
        ArkService service = ArkService.builder()
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
                .dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .apiKey(apiKey)
                .build();

        GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
                .model("doubao-seedream-4-5-251128") // Replace with Model ID
                .prompt("将图1的服装换为图2的服装")
                .image(Arrays.asList(
                    "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png",
                    "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imagesToimage_2.png"
                ))
                .size("2K")
                .sequentialImageGeneration("disabled")
                .responseFormat(ResponseFormat.Url)
                .stream(false)
                .watermark(false)
                .build();
        ImagesResponse imagesResponse = service.generateImages(generateRequest);
        System.out.println(imagesResponse.getData().get(0).getUrl());

        service.shutdownExecutor();
    }
}
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Go" key="eknWwqmZwX"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "fmt"
    "os"
    "strings"
    
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
    "github.com/volcengine/volcengine-go-sdk/volcengine"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        os.Getenv("ARK_API_KEY"),
        // The base URL for model invocation
        arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
    )    
    ctx := context.Background()

    generateReq := model.GenerateImagesRequest{
       Model:          "doubao-seedream-4-5-251128",
       Prompt:         "将图1的服装换为图2的服装",
       Image:         []string{
           "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png",
           "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imagesToimage_2.png",
       },
       Size:           volcengine.String("2K"),
       ResponseFormat: volcengine.String(model.GenerateImagesResponseFormatURL),
       Watermark:      volcengine.Bool(false),
    }

    imagesResponse, err := client.GenerateImages(ctx, generateReq)
    if err != nil {
       fmt.Printf("generate images error: %v\\n", err)
       return
    }

    fmt.Printf("%s\\n", *imagesResponse.Data[0].Url)
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="OpenAI" key="Ulcvo6b9IM"><RenderMd content={`\`\`\`Python
import os
from openai import OpenAI

client = OpenAI( 
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    model="doubao-seedream-4-5-251128",
    prompt="将图1的服装换为图2的服装",
    size="2K",
    response_format="url",
    
    extra_body = {
        "image": ["https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png", "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_5_imagesToimage_2.png"],
        "watermark": false,
        "sequential_image_generation": "disabled",
    }
) 
 
print(imagesResponse.data[0].url)
\`\`\`


`}></RenderMd></Tabs.TabPane></Tabs>);
 ```


<span id="fc9f85e4"></span>
## 组图输出（多图输出）
支持通过一张或者多张图片和文字信息，生成漫画分镜、品牌视觉等一组内容关联的图片。
需指定参数 **sequential_image_generation** 为`auto`。
<span id="ec79cfda"></span>
### 文生组图

---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.6702127659574468);">

提示词


</div>
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.32978723404255317);margin-left: 16px;">

输出（实际会输出4张图片）


</div>
</div>


<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.6717325227963526);">

生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围


</div>
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.3282674772036474);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/9df00a4f19e84efc9946f7033a4cf80d~tplv-goo7wpa0wc-image.image" width="1728px" /></div>



</div>
</div>




```mixin-react
return (<Tabs>
<Tabs.TabPane title="Curl" key="jvdpD4IxZ3"><RenderMd content={`\`\`\`Plain Text
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ARK_API_KEY" \\
  -d '{
    "model": "doubao-seedream-4-5-251128",
    "prompt": "生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围",
    "size": "2K",
    "sequential_image_generation": "auto",
    "sequential_image_generation_options": {
        "max_images": 4
    },
    "stream": false,
    "response_format": "url",
    "watermark": false
}'
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python" key="IORGkhYwjj"><RenderMd content={`\`\`\`Python
import os
# Install SDK:  pip install 'volcengine-python-sdk[ark]'
from volcenginesdkarkruntime import Ark 
from volcenginesdkarkruntime.types.images.images import SequentialImageGenerationOptions

client = Ark(
    # The base URL for model invocation .
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    # Replace with Model ID
    model="doubao-seedream-4-5-251128", 
    prompt="生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围",
    size="2K",
    sequential_image_generation="auto",
    sequential_image_generation_options=SequentialImageGenerationOptions(max_images=4),
    response_format="url",
    watermark=False
) 
 
# Iterate through all image data
for image in imagesResponse.data:
    # Output the current image's URL and size
    print(f"URL: {image.url}, Size: {image.size}")
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="XCl3OTTz9G"><RenderMd content={`\`\`\`Java
package com.ark.sample;


import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.Arrays; 
import java.util.List; 
import java.util.concurrent.TimeUnit;

public class ImageGenerationsExample { 
    public static void main(String[] args) {
        String apiKey = System.getenv("ARK_API_KEY");
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();
        ArkService service = ArkService.builder()
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
                .dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .apiKey(apiKey)
                .build();
        
        GenerateImagesRequest.SequentialImageGenerationOptions sequentialImageGenerationOptions = new GenerateImagesRequest.SequentialImageGenerationOptions();
        sequentialImageGenerationOptions.setMaxImages(4);
        GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
                 .model("doubao-seedream-4-5-251128")  // Replace with Model ID
                 .prompt("生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围")
                 .responseFormat(ResponseFormat.Url)
                 .size("2K")
                 .sequentialImageGeneration("auto")
                 .sequentialImageGenerationOptions(sequentialImageGenerationOptions)
                 .stream(false)
                 .watermark(false)
                 .build();
        ImagesResponse imagesResponse = service.generateImages(generateRequest);
        // Iterate through all image data
        if (imagesResponse != null && imagesResponse.getData() != null) {
            for (int i = 0; i < imagesResponse.getData().size(); i++) {
                // Retrieve image information
                String url = imagesResponse.getData().get(i).getUrl();
                String size = imagesResponse.getData().get(i).getSize();
                System.out.printf("Image %d:%n", i + 1);
                System.out.printf("  URL: %s%n", url);
                System.out.printf("  Size: %s%n", size);
                System.out.println();
            }


            service.shutdownExecutor();
        }
    }
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Go" key="vg7cWup16l"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "fmt"
    "os"
    "strings"
    
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
    "github.com/volcengine/volcengine-go-sdk/volcengine"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        os.Getenv("ARK_API_KEY"),
        // The base URL for model invocation
        arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
    )    
    ctx := context.Background()
    
    var sequentialImageGeneration model.SequentialImageGeneration = "auto"
    maxImages := 4
    generateReq := model.GenerateImagesRequest{
       Model:          "doubao-seedream-4-5-251128",
       Prompt:         "生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围",
       Size:           volcengine.String("2K"),
       ResponseFormat: volcengine.String(model.GenerateImagesResponseFormatURL),
       Watermark:      volcengine.Bool(false),
       SequentialImageGeneration: &sequentialImageGeneration,
       SequentialImageGenerationOptions: &model.SequentialImageGenerationOptions{
          MaxImages: &maxImages,
       },
    }

    resp, err := client.GenerateImages(ctx, generateReq)
    if err != nil {
        fmt.Printf("call GenerateImages error: %v\\n", err)
        return
    }

    if resp.Error != nil {
        fmt.Printf("API returned error: %s - %s\\n", resp.Error.Code, resp.Error.Message)
        return
    }

    // Output the generated image information
    fmt.Printf("Generated %d images:\\n", len(resp.Data))
    for i, image := range resp.Data {
        var url string
        if image.Url != nil {
            url = *image.Url
        } else {
            url = "N/A"
        }
        fmt.Printf("Image %d: Size: %s, URL: %s\\n", i+1, image.Size, url)
    }
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="OpenAI" key="DmHnELxcxU"><RenderMd content={`\`\`\`Python
import os
from openai import OpenAI

client = OpenAI( 
    # The base URL for model invocation .
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    model="doubao-seedream-4-5-251128",
    prompt="生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围",
    size="2K",
    response_format="url",
    extra_body={
        "watermark": false,
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {
            "max_images": 4
        },
    },
) 
 
# Iterate through all image data
for image in imagesResponse.data:
    # Output the current image's URL and size
    print(f"URL: {image.url}, Size: {image.size}")
\`\`\`

`}></RenderMd></Tabs.TabPane></Tabs>);
 ```

<span id="a80c411f"></span>
### 单张图生组图

---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);">

提示词


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

输入图


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

输出（实际会输出4张图片）


</div>
</div>


<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);">

参考这个LOGO，做一套户外运动品牌视觉设计，品牌名称为“GREEN"，包括包装袋、帽子、卡片、挂绳等。绿色视觉主色调，趣味、简约现代风格。


</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/c724450228a94a909580c0400fbf503b~tplv-goo7wpa0wc-image.image" width="1280px" /></div>




</div>
<div style="flex-shrink: 0;width: calc((100% - 32px) * 0.3333);margin-left: 16px;">

<div style="text-align: center"><img src="https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/f2d33219328149f58552dfd095b5f502~tplv-goo7wpa0wc-image.image" width="1200px" /></div>



</div>
</div>


```mixin-react
return (<Tabs>
<Tabs.TabPane title="Curl" key="WJVoP0jMIs"><RenderMd content={`\`\`\`Plain Text
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ARK_API_KEY" \\
  -d '{
    "model": "doubao-seedream-4-5-251128",
    "prompt": "参考这个LOGO，做一套户外运动品牌视觉设计，品牌名称为“GREEN"，包括包装袋、帽子、卡片、挂绳等。绿色视觉主色调，趣味、简约现代风格",
    "image": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages.png",
    "size": "2K",
    "sequential_image_generation": "auto",
    "sequential_image_generation_options": {
        "max_images": 4
    },
    "stream": false,
    "response_format": "url",
    "watermark": false
}'
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python" key="VlhWGGcYEu"><RenderMd content={`\`\`\`Python
import os
# Install SDK:  pip install 'volcengine-python-sdk[ark]' .
from volcenginesdkarkruntime import Ark 
from volcenginesdkarkruntime.types.images.images import SequentialImageGenerationOptions

client = Ark(
    # The base URL for model invocation .
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    # Replace with Model ID .
    model="doubao-seedream-4-5-251128",
    prompt="参考这个LOGO，做一套户外运动品牌视觉设计，品牌名称为“GREEN"，包括包装袋、帽子、卡片、挂绳等。绿色视觉主色调，趣味、简约现代风格",
    image="https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages.png",
    size="2K",
    sequential_image_generation="auto",
    sequential_image_generation_options=SequentialImageGenerationOptions(max_images=4),
    response_format="url",
    watermark=False
) 
 
# Iterate through all image data
for image in imagesResponse.data:
    # Output the current image's URL and size
    print(f"URL: {image.url}, Size: {image.size}")
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="j4SWZoWMAj"><RenderMd content={`\`\`\`Java
package com.ark.sample;


import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.Arrays; 
import java.util.List; 
import java.util.concurrent.TimeUnit;

public class ImageGenerationsExample { 
    public static void main(String[] args) {
        String apiKey = System.getenv("ARK_API_KEY");
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();
        ArkService service = ArkService.builder()
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
                .dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .apiKey(apiKey)
                .build();
        
        GenerateImagesRequest.SequentialImageGenerationOptions sequentialImageGenerationOptions = new GenerateImagesRequest.SequentialImageGenerationOptions();
        sequentialImageGenerationOptions.setMaxImages(4);
        GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
                 .model("doubao-seedream-4-5-251128") // Replace with Model ID
                 .prompt("参考这个LOGO，做一套户外运动品牌视觉设计，品牌名称为“GREEN"，包括包装袋、帽子、卡片、挂绳等。绿色视觉主色调，趣味、简约现代风格")
                 .image("https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages.png")
                 .responseFormat(ResponseFormat.Url)
                 .size("2K")
                 .sequentialImageGeneration("auto")
                 .sequentialImageGenerationOptions(sequentialImageGenerationOptions)
                 .stream(false)
                 .watermark(false)
                 .build();
        ImagesResponse imagesResponse = service.generateImages(generateRequest);
        // Iterate through all image data
        if (imagesResponse != null && imagesResponse.getData() != null) {
            for (int i = 0; i < imagesResponse.getData().size(); i++) {
                // Retrieve image information
                String url = imagesResponse.getData().get(i).getUrl();
                String size = imagesResponse.getData().get(i).getSize();
                System.out.printf("Image %d:%n", i + 1);
                System.out.printf("  URL: %s%n", url);
                System.out.printf("  Size: %s%n", size);
                System.out.println();
            }


            service.shutdownExecutor();
        }
    }
}
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Go" key="pYfeq7XTxA"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "fmt"
    "os"
    "strings"
    
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
    "github.com/volcengine/volcengine-go-sdk/volcengine"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        os.Getenv("ARK_API_KEY"),
        // The base URL for model invocation
        arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
    )    
    ctx := context.Background()
    
    var sequentialImageGeneration model.SequentialImageGeneration = "auto"
    maxImages := 4
    generateReq := model.GenerateImagesRequest{
       Model:          "doubao-seedream-4-5-251128",
       Prompt:         "参考这个LOGO，做一套户外运动品牌视觉设计，品牌名称为“GREEN"，包括包装袋、帽子、卡片、挂绳等。绿色视觉主色调，趣味、简约现代风格",
       Image:          volcengine.String("https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages.png"),
       Size:           volcengine.String("2K"),
       ResponseFormat: volcengine.String(model.GenerateImagesResponseFormatURL),
       Watermark:      volcengine.Bool(false),
       SequentialImageGeneration: &sequentialImageGeneration,
       SequentialImageGenerationOptions: &model.SequentialImageGenerationOptions{
          MaxImages: &maxImages,
       },
    }

    resp, err := client.GenerateImages(ctx, generateReq)
    if err != nil {
        fmt.Printf("call GenerateImages error: %v\\n", err)
        return
    }

    if resp.Error != nil {
        fmt.Printf("API returned error: %s - %s\\n", resp.Error.Code, resp.Error.Message)
        return
    }

    // Output the generated image information
    fmt.Printf("Generated %d images:\\n", len(resp.Data))
    for i, image := range resp.Data {
        var url string
        if image.Url != nil {
            url = *image.Url
        } else {
            url = "N/A"
        }
        fmt.Printf("Image %d: Size: %s, URL: %s\\n", i+1, image.Size, url)
    }
}
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="OpenAI" key="gpGvd4xRUK"><RenderMd content={`\`\`\`Python
import os
from openai import OpenAI

client = OpenAI( 
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    model="doubao-seedream-4-5-251128", 
    prompt="参考这个LOGO，做一套户外运动品牌视觉设计，品牌名称为“GREEN"，包括包装袋、帽子、卡片、挂绳等。绿色视觉主色调，趣味、简约现代风格", 
    size="2K",
    response_format="url",
    extra_body={
        "image": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages.png",
        "watermark": false,
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {
            "max_images": 4
        },
    }   
) 
 
# Iterate through all image data
for image in imagesResponse.data:
    # Output the current image's URL and size
    print(f"URL: {image.url}, Size: {image.size}")
\`\`\`

`}></RenderMd></Tabs.TabPane></Tabs>);
 ```

<span id="ef168e47"></span>
### 多参考图生组图

---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.20121951219512196);">

提示词


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.2682926829268293);margin-left: 16px;">

输入图1


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.26265877035767166);margin-left: 16px;">

输入图2


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.26782903452037715);margin-left: 16px;">

输出（实际会输出3张图片）


</div>
</div>


<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.19728434504792333);">

生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片，涵盖早晨、中午、晚上


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.26916932907348246);margin-left: 16px;">

![Image](https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/77024d8e03f24862b066bfc385301120~tplv-goo7wpa0wc-image.image =1446x)


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.2675718849840255);margin-left: 16px;">

![Image](https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/2cbc5cf5a68d44899fc52f177fb9cf51~tplv-goo7wpa0wc-image.image =1446x)


</div>
<div style="flex-shrink: 0;width: calc((100% - 48px) * 0.2659744408945687);margin-left: 16px;">

![Image](https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/6971832f48384aea82b6009006cd3e56~tplv-goo7wpa0wc-image.image =1200x)


</div>
</div>


```mixin-react
return (<Tabs>
<Tabs.TabPane title="Curl" key="awE8UkR1HU"><RenderMd content={`\`\`\`Plain Text
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ARK_API_KEY" \\
  -d '{
    "model": "doubao-seedream-4-5-251128",
    "prompt": "生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片，涵盖早晨、中午、晚上",
    "image": ["https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_1.png", "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_2.png"],
    "sequential_image_generation": "auto",
    "sequential_image_generation_options": {
        "max_images": 3
    },
    "size": "2K",
    "watermark": false
}'
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python" key="RdpLTBXWmL"><RenderMd content={`\`\`\`Python
import os
# Install SDK:  pip install 'volcengine-python-sdk[ark]' .
from volcenginesdkarkruntime import Ark 
from volcenginesdkarkruntime.types.images.images import SequentialImageGenerationOptions

client = Ark(
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    # Replace with Model ID
    model="doubao-seedream-4-5-251128",
    prompt="生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片，涵盖早晨、中午、晚上",
    image=["https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_1.png", "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_2.png"],
    size="2K",
    sequential_image_generation="auto",
    sequential_image_generation_options=SequentialImageGenerationOptions(max_images=3),
    response_format="url",
    watermark=False
) 
 
# Iterate through all image data
for image in imagesResponse.data:
    # Output the current image's URL and size
    print(f"URL: {image.url}, Size: {image.size}")
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="g6UPUoQDDy"><RenderMd content={`\`\`\`Java
package com.ark.sample;


import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.Arrays; 
import java.util.List; 
import java.util.concurrent.TimeUnit;

public class ImageGenerationsExample { 
    public static void main(String[] args) {
        String apiKey = System.getenv("ARK_API_KEY");
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();
        ArkService service = ArkService.builder()
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
                .dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .apiKey(apiKey)
                .build();

        GenerateImagesRequest.SequentialImageGenerationOptions sequentialImageGenerationOptions = new GenerateImagesRequest.SequentialImageGenerationOptions();
        sequentialImageGenerationOptions.setMaxImages(3);
        GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
                 .model("doubao-seedream-4-5-251128") // Replace with Model ID
                 .prompt("生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片，涵盖早晨、中午、晚上")
                 .image(Arrays.asList(
                     "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_1.png",
                     "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_2.png"
                 ))
                 .responseFormat(ResponseFormat.Url)
                 .size("2K")
                 .sequentialImageGeneration("auto")
                 .sequentialImageGenerationOptions(sequentialImageGenerationOptions)
                 .stream(false)
                 .watermark(false)
                 .build();
        ImagesResponse imagesResponse = service.generateImages(generateRequest);

        // Iterate through all image data
        if (imagesResponse != null && imagesResponse.getData() != null) {
            for (int i = 0; i < imagesResponse.getData().size(); i++) {
                // Retrieve image information
                String url = imagesResponse.getData().get(i).getUrl();
                String size = imagesResponse.getData().get(i).getSize();
                System.out.printf("Image %d:%n", i + 1);
                System.out.printf("  URL: %s%n", url);
                System.out.printf("  Size: %s%n", size);
                System.out.println();
            }


            service.shutdownExecutor();
        }
    }
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Go" key="zJ02kJ84dP"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "fmt"
    "os"
    "strings"
    
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
    "github.com/volcengine/volcengine-go-sdk/volcengine"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        os.Getenv("ARK_API_KEY"),
        // The base URL for model invocation
        arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
    )    
    ctx := context.Background()
    
    var sequentialImageGeneration model.SequentialImageGeneration = "auto"
    maxImages := 5
    generateReq := model.GenerateImagesRequest{
       Model:          "doubao-seedream-4-5-251128",
       Prompt:         "生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片，涵盖早晨、中午、晚上",
       Image:         []string{
           "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_1.png",
           "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_2.png",
       },

       Size:           volcengine.String("2K"),
       ResponseFormat: volcengine.String(model.GenerateImagesResponseFormatURL),
       Watermark:      volcengine.Bool(false),
       SequentialImageGeneration: &sequentialImageGeneration,
       SequentialImageGenerationOptions: &model.SequentialImageGenerationOptions{
          MaxImages: &maxImages,
       },
    }

    resp, err := client.GenerateImages(ctx, generateReq)
    if err != nil {
        fmt.Printf("call GenerateImages error: %v\\n", err)
        return
    }

    if resp.Error != nil {
        fmt.Printf("API returned error: %s - %s\\n", resp.Error.Code, resp.Error.Message)
        return
    }

    // Output the generated image information
    fmt.Printf("Generated %d images:\\n", len(resp.Data))
    for i, image := range resp.Data {
        var url string
        if image.Url != nil {
            url = *image.Url
        } else {
            url = "N/A"
        }
        fmt.Printf("Image %d: Size: %s, URL: %s\\n", i+1, image.Size, url)
    }
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="OpenAI" key="wKqTK0LvVd"><RenderMd content={`\`\`\`Python
import os
from openai import OpenAI

client = OpenAI( 
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    model="doubao-seedream-4-5-251128", 
    prompt="生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片，涵盖早晨、中午、晚上",
    size="2K",
    response_format="url",
    extra_body={
        "image": ["https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_1.png", "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimages_2.png"],
        "watermark": false,
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {
            "max_images": 3
        },
    }   
) 
 
# Iterate through all image data
for image in imagesResponse.data:
    # Output the current image's URL and size
    print(f"URL: {image.url}, Size: {image.size}")
\`\`\`

`}></RenderMd></Tabs.TabPane></Tabs>);
 ```

<span id="9971b247"></span>
## **提示词建议**

* 建议用**简洁连贯**的自然语言写明 **主体 + 行为 + 环境**，若对画面美学有要求，可用自然语言或短语补充 **风格**、**色彩**、**光影**、**构图** 等美学元素。详情可参见 [Seedream 4.0-4.5 提示词指南](/docs/82379/1829186)。
* 文本提示词（prompt）建议不超过300个汉字或600个英文单词。字数过多信息容易分散，模型可能因此忽略细节，只关注重点，造成图片缺失部分元素。

<span id="4d900593"></span>
# 进阶使用
<span id="e5bef0d7"></span>
## 流式输出
Seedream 4.5、Seedream 4.0 模型支持流式图像生成，模型生成完任一图片即返回结果，让您能更快浏览到生成的图像，改善等待体验。
通过设置 **stream** 参数为`true`，即可开启流式输出模式。
![Image](https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/643230864ffc43a8a37ef775cd51ac30~tplv-goo7wpa0wc-image.image =2036x)

```mixin-react
return (<Tabs>
<Tabs.TabPane title="Curl" key="CfNgQzWf3E"><RenderMd content={`\`\`\`Plain Text
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ARK_API_KEY" \\
  -d '{
    "model": "doubao-seedream-4-5-251128",
    "prompt": "参考图1，生成四图片，图中人物分别带着墨镜，骑着摩托，带着帽子，拿着棒棒糖",
    "image": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages_1.png",
    "sequential_image_generation": "auto",
    "sequential_image_generation_options": {
        "max_images": 4
    },
    "size": "2K",
    "stream": true,
    "watermark": false
}'
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python" key="oXcZvpRhjh"><RenderMd content={`\`\`\`Python
import os
# Install SDK:  pip install 'volcengine-python-sdk[ark]'
from volcenginesdkarkruntime import Ark 
from volcenginesdkarkruntime.types.images.images import SequentialImageGenerationOptions

client = Ark(
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 

if __name__ == "__main__":
    stream = client.images.generate(
        # Replace with Model ID
        model="doubao-seedream-4-5-251128",
        prompt="参考图1，生成四图片，图中人物分别带着墨镜，骑着摩托，带着帽子，拿着棒棒糖",
        image="https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages_1.png",
        size="2K",
        sequential_image_generation="auto",
        sequential_image_generation_options=SequentialImageGenerationOptions(max_images=4),
        response_format="url",
        stream=True,
        watermark=False
    )
    for event in stream:
        if event is None:
            continue
        if event.type == "image_generation.partial_failed":
            print(f"Stream generate images error: {event.error}")
            if event.error is not None and event.error.code.equal("InternalServiceError"):
                break
        elif event.type == "image_generation.partial_succeeded":
            if event.error is None and event.url:
                print(f"recv.Size: {event.size}, recv.Url: {event.url}")
        elif event.type == "image_generation.completed":
            if event.error is None:
                print("Final completed event:")
                print("recv.Usage:", event.usage)
        elif event.type == "image_generation.partial_image":
            print(f"Partial image index={event.partial_image_index}, size={len(event.b64_json)}")
\`\`\`

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="mpOxmKXDPg"><RenderMd content={`\`\`\`Java
package com.ark.sample;


import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.Arrays; 
import java.util.List; 
import java.util.concurrent.TimeUnit;

public class ImageGenerationsExample { 
    public static void main(String[] args) {
        String apiKey = System.getenv("ARK_API_KEY");
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();
        ArkService service = ArkService.builder()
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
                .dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .apiKey(apiKey)
                .build();
        
        GenerateImagesRequest.SequentialImageGenerationOptions sequentialImageGenerationOptions = new GenerateImagesRequest.SequentialImageGenerationOptions();
        sequentialImageGenerationOptions.setMaxImages(4);
        GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
                 .model("doubao-seedream-4-5-251128") //Replace with Model ID .
                 .prompt("参考图1，生成四图片，图中人物分别带着墨镜，骑着摩托，带着帽子，拿着棒棒糖")
                 .image("https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages_1.png")
                 .responseFormat(ResponseFormat.Url)
                 .size("2K")
                 .sequentialImageGeneration("auto")
                 .sequentialImageGenerationOptions(sequentialImageGenerationOptions)
                 .stream(true)
                 .watermark(false)
                 .build();
        System.out.println(generateRequest.toString());
        
        service.streamGenerateImages(generateRequest)
                .doOnError(Throwable::printStackTrace)
                .blockingForEach(
                        choice -> {
                            if (choice == null) return;
                            if ("image_generation.partial_failed".equals(choice.getType())) {
                                if (choice.getError() != null) {
                                    System.err.println("Stream generate images error: " + choice.getError());
                                    if (choice.getError().getCode() != null && choice.getError().getCode().equals("InternalServiceError")) {
                                        throw new RuntimeException("Server error, terminating stream.");
                                    }
                                }
                            }
                            else if ("image_generation.partial_succeeded".equals(choice.getType())) {
                                if (choice.getError() == null && choice.getUrl() != null && !choice.getUrl().isEmpty()) {
                                    System.out.printf("recv.Size: %s, recv.Url: %s%n", choice.getSize(), choice.getUrl());
                                }
                            }
                            else if ("image_generation.completed".equals(choice.getType())) {
                                if (choice.getError() == null && choice.getUsage() != null) {
                                    System.out.println("recv.Usage: " + choice.getUsage().toString());
                                }
                            }
                        }
                );
        service.shutdownExecutor();
    }
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Go" key="FB1s6iBDkI"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "fmt"
    "io"
    "os"
    "strings"
    
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
    "github.com/volcengine/volcengine-go-sdk/volcengine"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        os.Getenv("ARK_API_KEY"),
        // The base URL for model invocation
        arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
    )    
    ctx := context.Background()
    
    var sequentialImageGeneration model.SequentialImageGeneration = "auto"
    maxImages := 4
    generateReq := model.GenerateImagesRequest{
       Model:          "doubao-seedream-4-5-251128",
       Prompt:         "参考图1，生成四图片，图中人物分别带着墨镜，骑着摩托，带着帽子，拿着棒棒糖",
       Image:          volcengine.String("https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages_1.png"),
       Size:           volcengine.String("2K"),
       ResponseFormat: volcengine.String(model.GenerateImagesResponseFormatURL),
       Watermark:      volcengine.Bool(false),
       SequentialImageGeneration: &sequentialImageGeneration,
       SequentialImageGenerationOptions: &model.SequentialImageGenerationOptions{
          MaxImages: &maxImages,
       },
    }
    
    stream, err := client.GenerateImagesStreaming(ctx, generateReq)
    if err != nil {
       fmt.Printf("call GenerateImagesStreaming error: %v\\n", err)
       return
    }
    defer stream.Close()
    for {
       recv, err := stream.Recv()
       if err == io.EOF {
          break
       }
       if err != nil {
          fmt.Printf("Stream generate images error: %v\\n", err)
          break
       }
       if recv.Type == "image_generation.partial_failed" {
          fmt.Printf("Stream generate images error: %v\\n", recv.Error)
          if strings.EqualFold(recv.Error.Code, "InternalServiceError") {
             break
          }
       }
       if recv.Type == "image_generation.partial_succeeded" {
          if recv.Error == nil && recv.Url != nil {
             fmt.Printf("recv.Size: %s, recv.Url: %s\\n", recv.Size, *recv.Url)
          }
       }
       if recv.Type == "image_generation.completed" {
          if recv.Error == nil {
             fmt.Printf("recv.Usage: %v\\n", *recv.Usage)
          }
       }
    }
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="OpenAI" key="qQ3gFAycUo"><RenderMd content={`\`\`\`Python
import os
from openai import OpenAI

client = OpenAI( 
    # The base URL for model invocation .
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 

if __name__ == "__main__":
    stream = client.images.generate(
        model="doubao-seedream-4-5-251128",
        prompt="参考图1，生成四图片，图中人物分别带着墨镜，骑着摩托，带着帽子，拿着棒棒糖",
        size="2K",
        response_format="b64_json",
        stream=True,
        extra_body={
            "image": "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imageToimages_1.png",
            "watermark": false,
            "sequential_image_generation": "auto",
            "sequential_image_generation_options": {
                "max_images": 4
            },
        },
    )
    for event in stream:
        if event is None:
            continue
        elif event.type == "image_generation.partial_succeeded":
            if event.b64_json is not None:
                print(f"size={len(event.b64_json)}, base_64={event.b64_json}")
        elif event.type == "image_generation.completed":
            if event.usage is not None:
                print("Final completed event:")
                print("recv.Usage:", event.usage)
\`\`\`

`}></RenderMd></Tabs.TabPane></Tabs>);
 ```


<span id="6b32fe21"></span>
## 提示词优化控制
通过设置 **optimize_prompt_options.mode** 参数，您可以在 `standard` 模式和 `fast` 模式之间进行选择，以根据自身对图片质量和生成速度的不同需求来优化提示词。 

* 为平衡生成速度与图像质量，Seedream 4.0 支持将 **optimize_prompt_options.mode** 设置为 `fast` 模式以显著提升生成速度，但会在一定程度上牺牲图片质量。
* Seedream 4.5 专注于高质量图片输出，仅支持 `standard` 模式。


```mixin-react
return (<Tabs>
<Tabs.TabPane title="Curl" key="altX4YHIcE"><RenderMd content={`\`\`\`Plain Text
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ARK_API_KEY" \\
  -d '{
    "model": "doubao-seedream-4-0-250828",
    "prompt": "生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围",
    "size": "2K",
    "sequential_image_generation": "auto",
    "sequential_image_generation_options": {
        "max_images": 4
    },
    "optimize_prompt_options": {
        "mode": "fast"
    },
    "stream": false,
    "response_format": "url",
    "watermark": false
}'
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Python" key="MF5O1DIeMW"><RenderMd content={`\`\`\`Python
import os
# Install SDK:  pip install 'volcengine-python-sdk[ark]'
from volcenginesdkarkruntime import Ark 
from volcenginesdkarkruntime.types.images.images import SequentialImageGenerationOptions
from volcenginesdkarkruntime.types.images.images import OptimizePromptOptions

client = Ark(
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    # Replace with Model ID
    model="doubao-seedream-4-0-250828", 
    prompt="生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围",
    size="2K",
    sequential_image_generation="auto",
    sequential_image_generation_options=SequentialImageGenerationOptions(max_images=4),
    optimize_prompt_options=OptimizePromptOptions(mode="fast"),
    response_format="url",
    watermark=False
) 
 
# Iterate through all image data
for image in imagesResponse.data:
    # Output the current image's URL and size
    print(f"URL: {image.url}, Size: {image.size}")
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Java" key="HJlrQ042GU"><RenderMd content={`\`\`\`Java
package com.ark.sample;


import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;

import java.util.Arrays; 
import java.util.List; 
import java.util.concurrent.TimeUnit;

public class ImageGenerationsExample { 
    public static void main(String[] args) {
        String apiKey = System.getenv("ARK_API_KEY");
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();
        ArkService service = ArkService.builder()
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
                .dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .apiKey(apiKey)
                .build();
        
        GenerateImagesRequest.SequentialImageGenerationOptions sequentialImageGenerationOptions = new GenerateImagesRequest.SequentialImageGenerationOptions();
        sequentialImageGenerationOptions.setMaxImages(4);
        GenerateImagesRequest.OptimizePromptOptions optimizePromptOptions = new GenerateImagesRequest.OptimizePromptOptions();
        optimizePromptOptions.setMode("fast");
        
        GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
                 .model("doubao-seedream-4-0-250828")  //Replace with Model ID
                 .prompt("生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围")
                 .responseFormat(ResponseFormat.Url)
                 .size("2K")
                 .sequentialImageGeneration("auto")
                 .sequentialImageGenerationOptions(sequentialImageGenerationOptions)
                 .optimizePromptOptions(optimizePromptOptions)
                 .stream(false)
                 .watermark(false)
                 .build();
        ImagesResponse imagesResponse = service.generateImages(generateRequest);
        // Iterate through all image data
        if (imagesResponse != null && imagesResponse.getData() != null) {
            for (int i = 0; i < imagesResponse.getData().size(); i++) {
                // Retrieve image information
                String url = imagesResponse.getData().get(i).getUrl();
                String size = imagesResponse.getData().get(i).getSize();
                System.out.printf("Image %d:%n", i + 1);
                System.out.printf("  URL: %s%n", url);
                System.out.printf("  Size: %s%n", size);
                System.out.println();
            }


            service.shutdownExecutor();
        }
    }
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="Go" key="NQsC1kCBZM"><RenderMd content={`\`\`\`Go
package main

import (
    "context"
    "fmt"
    "os"
    "strings"
    
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime"
    "github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
    "github.com/volcengine/volcengine-go-sdk/volcengine"
)

func main() {
    client := arkruntime.NewClientWithApiKey(
        os.Getenv("ARK_API_KEY"),
        // The base URL for model invocation .
        arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
    )    
    ctx := context.Background()
    
    var (
    sequentialImageGeneration model.SequentialImageGeneration = "auto"
    maxImages = 4
    mode model.OptimizePromptMode = model.OptimizePromptModeFast
    )
    
    generateReq := model.GenerateImagesRequest{
       Model:          "doubao-seedream-4-0-250828",
       Prompt:         "生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围",
       Size:           volcengine.String("2K"),
       ResponseFormat: volcengine.String(model.GenerateImagesResponseFormatURL),
       Watermark:      volcengine.Bool(false),
       SequentialImageGeneration: &sequentialImageGeneration,
       SequentialImageGenerationOptions: &model.SequentialImageGenerationOptions{
          MaxImages: &maxImages,
       },
       OptimizePromptOptions: &model.OptimizePromptOptions{
       Mode: &mode,
       },
    }

    resp, err := client.GenerateImages(ctx, generateReq)
    if err != nil {
        fmt.Printf("call GenerateImages error: %v\\n", err)
        return
    }

    if resp.Error != nil {
        fmt.Printf("API returned error: %s - %s\\n", resp.Error.Code, resp.Error.Message)
        return
    }

    // Output the generated image information
    fmt.Printf("Generated %d images:\\n", len(resp.Data))
    for i, image := range resp.Data {
        var url string
        if image.Url != nil {
            url = *image.Url
        } else {
            url = "N/A"
        }
        fmt.Printf("Image %d: Size: %s, URL: %s\\n", i+1, image.Size, url)
    }
}
\`\`\`


`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="OpenAI" key="eM0p4JQV5o"><RenderMd content={`\`\`\`Python
import os
from openai import OpenAI

client = OpenAI( 
    # The base URL for model invocation
    base_url="https://ark.cn-beijing.volces.com/api/v3", 
    # Get API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apikey
    api_key=os.getenv('ARK_API_KEY'), 
) 
 
imagesResponse = client.images.generate( 
    model="doubao-seedream-4-0-250828",
    prompt="生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围",
    size="2K",
    response_format="url",
    extra_body={
        "watermark": false,
        "sequential_image_generation": "auto",
        "sequential_image_generation_options": {
            "max_images": 4
        },
        "optimize_prompt_options": {"mode": "fast"}
    },
) 
 
# Iterate through all image data
for image in imagesResponse.data:
    # Output the current image's URL and size
    print(f"URL: {image.url}, Size: {image.size}")
\`\`\`


* 您可按需替换 Model ID。Model ID 查询见 [模型列表](/docs/82379/1330310)。
`}></RenderMd></Tabs.TabPane></Tabs>);
 ```

<span id="3fa0345d"></span>
## 自定义图片输出规格
您可以配置以下参数来控制图片输出规格：

* **size** ：指定输出图片的尺寸大小。
* **response_format** ：指定生成图像的返回格式。
* **watermark** ：指定是否为输出图片添加水印。

<span id="034e4a46"></span>
### 图片输出尺寸
支持两种尺寸设置方式，不可混用。

* 方式 1 ：指定生成图像的分辨率，并在 prompt 中用自然语言描述图片宽高比、图片形状或图片用途，最终由模型判断生成图片的大小。
   * 可选值：`1K`(Seedream 4.5 不支持)、`2K`、`4K`
* 方式2 ：指定生成图像的宽高像素值。
   * 默认值：`2048x2048`
   * 总像素取值范围：
      * seedream 4.5：[`2560x1440=3686400`, `4096x4096=16777216`] 
      * seedream 4.0：[`1280x720=921600`, `4096x4096=16777216`] 
   * 宽高比取值范围：[1/16, 16]


---



<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.5000);">

方式1


</div>
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.5000);margin-left: 16px;">

方式2


</div>
</div>


<div style="display: flex;">
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.5000);">

```JSON
{
    "prompt": "生成一组共4张海报，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围", // prompt 中用自然语言描述图片宽高比、图片形状或图片用途
    "size": "2K"  // 通过参数 size 指定生成图像的分辨率
}
```



</div>
<div style="flex-shrink: 0;width: calc((100% - 16px) * 0.5000);margin-left: 16px;">

```JSON
{
    "prompt": "生成一组共4张连贯插画，核心为同一庭院一角的四季变迁，以统一风格展现四季独特色彩、元素与氛围", 
    "size": "2048x2048"  // 通过参数 size 指定生成图像的宽高像素值
}
```



</div>
</div>

<span id="b4306703"></span>
### 图片输出方式
图像 API 返回的图片格式为 jpeg 。通过设置 **response_format** 参数，可以指定生成图像的返回方式：

* `url`：返回图片下载链接。
* `b64_json`：以 Base64 编码字符串的 JSON 格式返回图像数据。

```JSON
{
    "response_format": "url"
}
```

<span id="6be7edc7"></span>
### 图片中添加水印
通过设置 **watermark** 参数，来控制是否在生成的图片中添加水印。

* `false`：不添加水印。
* `true`：在图片右下角添加“AI生成”字样的水印标识。

```JSON
{
    "watermark": true
}
```

<span id="31037d05"></span>
# 使用限制
**SDK 版本升级**
为保证模型功能的正常使用，请务必升级至最新 SDK 版本。相关步骤可参考 [安装及升级 SDK](/docs/82379/1541595)。

**图片传入限制**

* 图片格式：jpeg、png、webp、bmp、tiff、gif
* 宽高比（宽/高）范围：[1/16, 16]
* 宽高长度（px） > 14
* 大小：不超过 10 MB
* 总像素：不超过 6000×6000 px
* 最多支持传入 14 张参考图。


**保存时间**
任务数据（如任务状态、图片URL等）仅保留24小时，超时后会被自动清除。请您务必及时保存生成的图片。 

**限流说明**

* RPM 限流：账号下同模型（区分模型版本）每分钟生成图片数量上限。若超过该限制，生成图片时会报错。
* 不同模型的限制值不同，详见 [图片生成能力](/docs/82379/1330310#d3e5e0eb)。

<span id="cc254304"></span>
# 附：故事书/连环画制作
[火山方舟大模型体验中心](https://www.volcengine.com/experience/ark?mode=vision&model=doubao-seedream-4-0-250828) 提供了故事书和连环画功能，该功能结合了 doubao-seed-1.6 模型和 doubao-seedream-4.0 模型，可实现一句话生成动漫、连环画、故事书，满足用户多样化的创作需求。 
连环画的实现过程与故事书类似，本文以故事书为例，为您介绍生成故事书的工作流和技术实现步骤，方便您在本地快速复现。

![Image](https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/d590e440ff7447feaed8fa8f4d91e746~tplv-goo7wpa0wc-image.image =1712x)


<span id="6f9b6cd9"></span>
## 工作流
故事书生成的工作流如下：


<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDgycHgiIGhlaWdodD0iMzA5cHgiIHZpZXdCb3g9Ii0wLjUgLTAuNSAxMDgyIDMwOSI+PGRlZnMvPjxnPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIxMDc3IiBoZWlnaHQ9IjMwNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PHJlY3QgeD0iODEwIiB5PSI0MyIgd2lkdGg9IjIyNSIgaGVpZ2h0PSIyMTciIHJ4PSIyMS43IiByeT0iMjEuNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjE2IDYgMiA2IiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PHJlY3QgeD0iNDIiIHk9IjQzIiB3aWR0aD0iNzQwIiBoZWlnaHQ9IjIxNyIgcng9IjIxLjciIHJ5PSIyMS43IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iMTYgNiAyIDYiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cmVjdCB4PSI1MiIgeT0iMTE5IiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiByeD0iOSIgcnk9IjkiIGZpbGw9IiNmZmU1OTkiIHN0cm9rZT0iIzAwMDAwMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDExOHB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDE0OXB4OyBtYXJnaW4tbGVmdDogNTNweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgd29yZC13cmFwOiBub3JtYWw7ICI+PGZvbnQgc3R5bGU9ImZvbnQtc2l6ZToxNHB4Ij7mlYXkuovliJvkvZw8L2ZvbnQ+PC9kaXY+PC9kaXY+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjwvZz48cmVjdCB4PSIyNTIiIHk9IjExOSIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI2MCIgcng9IjkiIHJ5PSI5IiBmaWxsPSIjZmZlNTk5IiBzdHJva2U9IiMwMDAwMDAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIj48Zm9yZWlnbk9iamVjdCBzdHlsZT0ib3ZlcmZsb3c6IHZpc2libGU7IHRleHQtYWxpZ246IGxlZnQ7IiBwb2ludGVyLWV2ZW50cz0ibm9uZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxMThweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAxNDlweDsgbWFyZ2luLWxlZnQ6IDI1M3B4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm9ybWFsOyB3b3JkLXdyYXA6IG5vcm1hbDsgIj48Zm9udCBzdHlsZT0iZm9udC1zaXplOjE0cHgiPuaVheS6i+WIhumVnOaLhuinozwvZm9udD48L2Rpdj48L2Rpdj48L2Rpdj48L2ZvcmVpZ25PYmplY3Q+PC9nPjxwYXRoIGQ9Ik0gMTcyIDE0OSBMIDI0NS42MyAxNDkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0ic3Ryb2tlIi8+PHBhdGggZD0iTSAyNTAuODggMTQ5IEwgMjQzLjg4IDE1Mi41IEwgMjQ1LjYzIDE0OSBMIDI0My44OCAxNDUuNSBaIiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxyZWN0IHg9IjQ1MiIgeT0iMTE5IiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiByeD0iOSIgcnk9IjkiIGZpbGw9IiNmZmU1OTkiIHN0cm9rZT0iIzAwMDAwMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDExOHB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDE0OXB4OyBtYXJnaW4tbGVmdDogNDUzcHg7Ij48ZGl2IHN0eWxlPSJib3gtc2l6aW5nOiBib3JkZXItYm94OyBmb250LXNpemU6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgIj48ZGl2IHN0eWxlPSJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMTJweDsgZm9udC1mYW1pbHk6IEhlbHZldGljYTsgY29sb3I6ICMwMDAwMDA7IGxpbmUtaGVpZ2h0OiAxLjI7IHBvaW50ZXItZXZlbnRzOiBhbGw7IHdoaXRlLXNwYWNlOiBub3JtYWw7IHdvcmQtd3JhcDogbm9ybWFsOyAiPjxmb250IHN0eWxlPSJmb250LXNpemU6MTRweCI+5pWF5LqL5qCH6aKY44CB566A5LuL44CBPGJyIC8+5paH5qGI55Sf5oiQPC9mb250PjwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PHBhdGggZD0iTSAzNzIgMTQ5IEwgNDQ1LjYzIDE0OSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJzdHJva2UiLz48cGF0aCBkPSJNIDQ1MC44OCAxNDkgTCA0NDMuODggMTUyLjUgTCA0NDUuNjMgMTQ5IEwgNDQzLjg4IDE0NS41IFoiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PHJlY3QgeD0iNjUyIiB5PSIxMTkiIHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIHJ4PSI5IiByeT0iOSIgZmlsbD0iI2ZmZTU5OSIgc3Ryb2tlPSIjMDAwMDAwIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuNSAtMC41KSI+PGZvcmVpZ25PYmplY3Qgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyIgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogdW5zYWZlIGNlbnRlcjsganVzdGlmeS1jb250ZW50OiB1bnNhZmUgY2VudGVyOyB3aWR0aDogMTE4cHg7IGhlaWdodDogMXB4OyBwYWRkaW5nLXRvcDogMTQ5cHg7IG1hcmdpbi1sZWZ0OiA2NTNweDsiPjxkaXYgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMDsgdGV4dC1hbGlnbjogY2VudGVyOyAiPjxkaXYgc3R5bGU9ImRpc3BsYXk6IGlubGluZS1ibG9jazsgZm9udC1zaXplOiAxMnB4OyBmb250LWZhbWlseTogSGVsdmV0aWNhOyBjb2xvcjogIzAwMDAwMDsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgd29yZC13cmFwOiBub3JtYWw7ICI+PGZvbnQgc3R5bGU9ImZvbnQtc2l6ZToxNHB4Ij7mlYXkuovphY3lm748YnIgLz5wcm9tcHTnlJ/miJA8L2ZvbnQ+PC9kaXY+PC9kaXY+PC9kaXY+PC9mb3JlaWduT2JqZWN0PjwvZz48cGF0aCBkPSJNIDU3MiAxNDkgTCA2NDUuNjMgMTQ5IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9InN0cm9rZSIvPjxwYXRoIGQ9Ik0gNjUwLjg4IDE0OSBMIDY0My44OCAxNTIuNSBMIDY0NS42MyAxNDkgTCA2NDMuODggMTQ1LjUgWiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48cmVjdCB4PSI4NTIiIHk9IjExOSIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI2MCIgcng9IjkiIHJ5PSI5IiBmaWxsPSIjY2NlNWZmIiBzdHJva2U9IiMwMDAwMDAiIHBvaW50ZXItZXZlbnRzPSJhbGwiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIj48Zm9yZWlnbk9iamVjdCBzdHlsZT0ib3ZlcmZsb3c6IHZpc2libGU7IHRleHQtYWxpZ246IGxlZnQ7IiBwb2ludGVyLWV2ZW50cz0ibm9uZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxMThweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAxNDlweDsgbWFyZ2luLWxlZnQ6IDg1M3B4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDEycHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjMDAwMDAwOyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm9ybWFsOyB3b3JkLXdyYXA6IG5vcm1hbDsgIj48Zm9udCBzdHlsZT0iZm9udC1zaXplOjE0cHgiPuaVheS6i+mFjeWbvueUn+aIkDwvZm9udD48L2Rpdj48L2Rpdj48L2Rpdj48L2ZvcmVpZ25PYmplY3Q+PC9nPjxwYXRoIGQ9Ik0gNzcyIDE0OSBMIDg0NS42MyAxNDkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBwb2ludGVyLWV2ZW50cz0ic3Ryb2tlIi8+PHBhdGggZD0iTSA4NTAuODggMTQ5IEwgODQzLjg4IDE1Mi41IEwgODQ1LjYzIDE0OSBMIDg0My44OCAxNDUuNSBaIiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxyZWN0IHg9IjMyNy41IiB5PSIyMDgiIHdpZHRoPSIxNjkiIGhlaWdodD0iMjkiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxmb3JlaWduT2JqZWN0IHN0eWxlPSJvdmVyZmxvdzogdmlzaWJsZTsgdGV4dC1hbGlnbjogbGVmdDsiIHBvaW50ZXItZXZlbnRzPSJub25lIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGl2IHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzdHlsZT0iZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IHVuc2FmZSBjZW50ZXI7IGp1c3RpZnktY29udGVudDogdW5zYWZlIGNlbnRlcjsgd2lkdGg6IDFweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAyMjNweDsgbWFyZ2luLWxlZnQ6IDQxMnB4OyI+PGRpdiBzdHlsZT0iYm94LXNpemluZzogYm9yZGVyLWJveDsgZm9udC1zaXplOiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7ICI+PGRpdiBzdHlsZT0iZGlzcGxheTogaW5saW5lLWJsb2NrOyBmb250LXNpemU6IDIxcHg7IGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7IGNvbG9yOiAjRkZEOTY2OyBsaW5lLWhlaWdodDogMS4yOyBwb2ludGVyLWV2ZW50czogYWxsOyB3aGl0ZS1zcGFjZTogbm93cmFwOyAiPjxmb250IHN0eWxlPSJmb250LXNpemU6MThweCI+ZG91YmFvLXNlZWQtMS42PC9mb250PjwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PHJlY3QgeD0iODk3IiB5PSIyMDgiIHdpZHRoPSI0OSIgaGVpZ2h0PSIyOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBwb2ludGVyLWV2ZW50cz0iYWxsIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuNSAtMC41KSI+PGZvcmVpZ25PYmplY3Qgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyIgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkaXYgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogdW5zYWZlIGNlbnRlcjsganVzdGlmeS1jb250ZW50OiB1bnNhZmUgY2VudGVyOyB3aWR0aDogMXB4OyBoZWlnaHQ6IDFweDsgcGFkZGluZy10b3A6IDIyM3B4OyBtYXJnaW4tbGVmdDogOTIycHg7Ij48ZGl2IHN0eWxlPSJib3gtc2l6aW5nOiBib3JkZXItYm94OyBmb250LXNpemU6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgIj48ZGl2IHN0eWxlPSJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMjFweDsgZm9udC1mYW1pbHk6IEhlbHZldGljYTsgY29sb3I6ICM3RUE2RTA7IGxpbmUtaGVpZ2h0OiAxLjI7IHBvaW50ZXItZXZlbnRzOiBhbGw7IHdoaXRlLXNwYWNlOiBub3dyYXA7ICI+PGZvbnQgc3R5bGU9ImZvbnQtc2l6ZToxOHB4Ij5kb3ViYW8tc2VlZHJlYW0tNC4wPC9mb250PjwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48L2c+PC9nPjwvc3ZnPg==" from="flow-chart" payload="{&quot;data&quot;:{&quot;mxGraphModel&quot;:{&quot;dx&quot;:&quot;1186&quot;,&quot;dy&quot;:&quot;791&quot;,&quot;grid&quot;:&quot;0&quot;,&quot;gridSize&quot;:&quot;10&quot;,&quot;guides&quot;:&quot;1&quot;,&quot;tooltips&quot;:&quot;1&quot;,&quot;connect&quot;:&quot;1&quot;,&quot;arrows&quot;:&quot;1&quot;,&quot;fold&quot;:&quot;1&quot;,&quot;page&quot;:&quot;0&quot;,&quot;pageScale&quot;:&quot;1&quot;,&quot;pageWidth&quot;:&quot;827&quot;,&quot;pageHeight&quot;:&quot;1169&quot;},&quot;mxCellMap&quot;:{&quot;1hY8BOpv&quot;:{&quot;id&quot;:&quot;1hY8BOpv&quot;},&quot;tk8feSlP&quot;:{&quot;id&quot;:&quot;tk8feSlP&quot;,&quot;style&quot;:&quot;&quot;,&quot;parent&quot;:&quot;1hY8BOpv&quot;},&quot;uJn7bRCH&quot;:{&quot;id&quot;:&quot;uJn7bRCH&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;rounded=0;whiteSpace=wrap;html=1;strokeColor=none;&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Rectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;parent&quot;:&quot;tk8feSlP&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;302&quot;,&quot;y&quot;:&quot;361&quot;,&quot;width&quot;:&quot;1077&quot;,&quot;height&quot;:&quot;304&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;dfnqfF1m&quot;:{&quot;id&quot;:&quot;dfnqfF1m&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;group&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;connectable&quot;:&quot;0&quot;,&quot;parent&quot;:&quot;tk8feSlP&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;342&quot;,&quot;y&quot;:&quot;402&quot;,&quot;width&quot;:&quot;993&quot;,&quot;height&quot;:&quot;217&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;i0DlOEcd&quot;:{&quot;id&quot;:&quot;i0DlOEcd&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;group&quot;,&quot;parent&quot;:&quot;dfnqfF1m&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;connectable&quot;:&quot;0&quot;,&quot;-0-mxGeometry&quot;:{&quot;width&quot;:&quot;993&quot;,&quot;height&quot;:&quot;217&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;mOzlLPF8&quot;:{&quot;id&quot;:&quot;mOzlLPF8&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;rounded=1;arcSize=10;dashed=1;strokeColor=#000000;fillColor=none;gradientColor=none;dashPattern=8 3 1 3;strokeWidth=2;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Group&quot;,&quot;diagramCategory&quot;:&quot;BPMN general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;768&quot;,&quot;width&quot;:&quot;225&quot;,&quot;height&quot;:&quot;217&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;9X8NsMiZ&quot;:{&quot;id&quot;:&quot;9X8NsMiZ&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;rounded=1;arcSize=10;dashed=1;strokeColor=#000000;fillColor=none;gradientColor=none;dashPattern=8 3 1 3;strokeWidth=2;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;Group&quot;,&quot;diagramCategory&quot;:&quot;BPMN general&quot;,&quot;-0-mxGeometry&quot;:{&quot;width&quot;:&quot;740&quot;,&quot;height&quot;:&quot;217&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;Nl41c3Oz&quot;:{&quot;id&quot;:&quot;Nl41c3Oz&quot;,&quot;value&quot;:&quot;<font style=\&quot;font-size:14px\&quot;>故事创作</font>&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE599;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;10&quot;,&quot;y&quot;:&quot;76&quot;,&quot;width&quot;:&quot;120&quot;,&quot;height&quot;:&quot;60&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;XIeCrqcA&quot;:{&quot;id&quot;:&quot;XIeCrqcA&quot;,&quot;value&quot;:&quot;<font style=\&quot;font-size:14px\&quot;>故事分镜拆解</font>&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE599;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;210&quot;,&quot;y&quot;:&quot;76&quot;,&quot;width&quot;:&quot;120&quot;,&quot;height&quot;:&quot;60&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;28J6bNlJ&quot;:{&quot;id&quot;:&quot;28J6bNlJ&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;source&quot;:&quot;Nl41c3Oz&quot;,&quot;target&quot;:&quot;XIeCrqcA&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;NP8Df4r3&quot;:{&quot;id&quot;:&quot;NP8Df4r3&quot;,&quot;value&quot;:&quot;<font style=\&quot;font-size:14px\&quot;>故事标题、简介、<br />文案生成</font>&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE599;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;410&quot;,&quot;y&quot;:&quot;76&quot;,&quot;width&quot;:&quot;120&quot;,&quot;height&quot;:&quot;60&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;c0AVaicU&quot;:{&quot;id&quot;:&quot;c0AVaicU&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;source&quot;:&quot;XIeCrqcA&quot;,&quot;target&quot;:&quot;NP8Df4r3&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;NyyhQrJD&quot;:{&quot;id&quot;:&quot;NyyhQrJD&quot;,&quot;value&quot;:&quot;<font style=\&quot;font-size:14px\&quot;>故事配图<br />prompt生成</font>&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE599;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;610&quot;,&quot;y&quot;:&quot;76&quot;,&quot;width&quot;:&quot;120&quot;,&quot;height&quot;:&quot;60&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;31AeePhF&quot;:{&quot;id&quot;:&quot;31AeePhF&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;source&quot;:&quot;NP8Df4r3&quot;,&quot;target&quot;:&quot;NyyhQrJD&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;vWTz9Pn5&quot;:{&quot;id&quot;:&quot;vWTz9Pn5&quot;,&quot;value&quot;:&quot;<font style=\&quot;font-size:14px\&quot;>故事配图生成</font>&quot;,&quot;style&quot;:&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#CCE5FF;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;diagramName&quot;:&quot;RoundedRectangle&quot;,&quot;diagramCategory&quot;:&quot;general&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;810&quot;,&quot;y&quot;:&quot;76&quot;,&quot;width&quot;:&quot;120&quot;,&quot;height&quot;:&quot;60&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;9Xr6RWXQ&quot;:{&quot;id&quot;:&quot;9Xr6RWXQ&quot;,&quot;value&quot;:&quot;&quot;,&quot;style&quot;:&quot;edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;source&quot;:&quot;NyyhQrJD&quot;,&quot;target&quot;:&quot;vWTz9Pn5&quot;,&quot;edge&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;relative&quot;:&quot;1&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;J1jOoH0n&quot;:{&quot;id&quot;:&quot;J1jOoH0n&quot;,&quot;value&quot;:&quot;<font style=\&quot;font-size:18px\&quot;>doubao-seed-1.6</font>&quot;,&quot;style&quot;:&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;fontSize=21;fontColor=#FFD966;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;285.5&quot;,&quot;y&quot;:&quot;165&quot;,&quot;width&quot;:&quot;169&quot;,&quot;height&quot;:&quot;29&quot;,&quot;as&quot;:&quot;geometry&quot;}},&quot;tJTCip0t&quot;:{&quot;id&quot;:&quot;tJTCip0t&quot;,&quot;value&quot;:&quot;<font style=\&quot;font-size:18px\&quot;>doubao-seedream-4.0</font>&quot;,&quot;style&quot;:&quot;text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;fontSize=21;fontColor=#7EA6E0;&quot;,&quot;parent&quot;:&quot;i0DlOEcd&quot;,&quot;vertex&quot;:&quot;1&quot;,&quot;-0-mxGeometry&quot;:{&quot;x&quot;:&quot;855&quot;,&quot;y&quot;:&quot;165&quot;,&quot;width&quot;:&quot;49&quot;,&quot;height&quot;:&quot;29&quot;,&quot;as&quot;:&quot;geometry&quot;}}},&quot;mxCellList&quot;:[&quot;1hY8BOpv&quot;,&quot;tk8feSlP&quot;,&quot;uJn7bRCH&quot;,&quot;dfnqfF1m&quot;,&quot;i0DlOEcd&quot;,&quot;mOzlLPF8&quot;,&quot;9X8NsMiZ&quot;,&quot;Nl41c3Oz&quot;,&quot;XIeCrqcA&quot;,&quot;28J6bNlJ&quot;,&quot;NP8Df4r3&quot;,&quot;c0AVaicU&quot;,&quot;NyyhQrJD&quot;,&quot;31AeePhF&quot;,&quot;vWTz9Pn5&quot;,&quot;9Xr6RWXQ&quot;,&quot;J1jOoH0n&quot;,&quot;tJTCip0t&quot;]},&quot;lastEditTime&quot;:0,&quot;snapshot&quot;:&quot;&quot;}" />


<span id="636dd480"></span>
## 技术实现

1. 根据用户提供的提示词和参考图，调用 doubao-seed-1.6 模型，进行故事创作 > 故事分镜拆解 > 生成分镜的文案和画面描述 > 生成书名 > 生成故事总结，并汇总成 JSON 格式输出。

System Prompt 如下：
```Plain Text
# 角色

你是一位**绘本创作大师**。

## 任务

贴合用户指定的**读者群（儿童/青少年/成人/全年龄）**，创作**情节线性连贯的、生动有趣的、充满情绪价值和温度的、有情感共鸣的、分镜-文案-画面严格顺序对应的绘本内容**：
- 核心约束：**分镜拆分→文案（scenes）→画面描述（scenes_detail）必须1:1顺序绑定**，从故事开头到结尾，像「放电影」一样按时间线推进，绝无错位。

## 工作流程

1.  充分理解用户诉求。 优先按照用户的创作细节要求执行（如果有）
2.  **故事构思:** 创作一个能够精准回应用户诉求、提供情感慰藉的故事脉络。整个故事必须围绕“共情”和“情绪价值”展开。
3.  **分镜结构与数量:**
    * 将故事浓缩成 **5~10** 个关键分镜，最多10个（不能超过10个）。
    * 必须遵循清晰的叙事弧线：开端 → 发展 → 高潮 → 结局。
4.  **文案与画面 (一一对应):**
    * **文案 ("scenes"字段):** 为每个分镜创作具备情感穿透力的文案。文案必须与画面描述紧密贴合，共同服务于情绪的传递。**禁止在文案中使用任何英文引号 ("")**。不能超过10个。
    * **画面 ("scenes_detail"字段):** 为每个分镜构思详细的画面。画风必须贴合用户诉求和故事氛围。描述需包含构图、光影、色彩、角色神态等关键视觉要素，达到可直接用于图片生成的标准。
5.  **书名 ("title"字段):**
    * 构思一个简洁、好记、有创意的书名。
    * 书名必须能巧妙地概括故事精髓，并能瞬间“戳中”目标用户的情绪共鸣点。
6.  **故事总结 ("summary"字段):**
    * 创作一句**不超过30个汉字**的总结。
    * 总结需高度凝练故事的核心思想与情感价值。
7. 整合输出：将所有内容按指定 JSON 格式整理输出。

## 安全限制
生成的内容必须严格遵守以下规定：
1.  **禁止暴力与血腥:** 不得包含任何详细的暴力、伤害、血腥或令人不适的画面描述。
2.  **禁止色情内容:** 不得包含任何色情、性暗示或不适宜的裸露内容。
3.  **禁止仇恨与歧视:** 不得包含针对任何群体（基于种族、宗教、性别、性取向等）的仇恨、歧视或攻击性言论。
4.  **禁止违法与危险行为:** 不得描绘或鼓励任何非法活动、自残或危险行为。
5.  **确保普遍适宜性:** 整体内容应保持在社会普遍接受的艺术创作范围内，避免极端争议性话题。

## 输出格式要求
整理成以下JSON格式，scenes 和 scenes_detail 要与分镜保持顺序一致，一一对应，最多10个（不能超过10个）：
{  
  "title": "书名",
  "summary": "30字内的总结",
  "scenes": [
    "分镜1的文案，用50字篇幅传递情绪和情感，引发读者共鸣，语言风格需符合设定。",
    "分镜2的文案"
  ],
  "scenes_detail": [
    "图片1：这是第一页的画面描述。必须以'图片'+序号开头。要有强烈的视觉感，详细描述构图（如特写、远景）、光影、色彩、角色表情、动作和环境细节，符合生图提示词的要求。",
    "图片2："
  ]
}
```


2. 提取返回结果 JSON 中的 scenes_detail 字段，作为图片生成的 Prompt 。
3. 处理图片生成的 Prompt:
   1. 将数组转化成字符串
   2. 在 prompt 末尾补充"最后，为故事书创作一个封面。 再检查所有图片，去除图片中的文字"。
   3. 在 prompt 开头添加用户输入的提示词。
4. 根据图片生成的 Prompt 和用户提供的参考图，调用 doubao-seedream-4.0 模型的生成组图能力，为故事的所有分镜文案生成配图。
5. 按照顺序拼装图片和文字即可得到故事书内容 ，用户按需进行展示即可。



<style>
    /* 表格容器：小屏横向滚动，限制最大宽度避免过宽 */
    .table-container {
        overflow-x: auto;
        max-width: 100%; /* 容器占满父级，不超出页面 */
    }
    /* 表格：宽度自适应，内容优先 */
    table {
        width: 100%; 
        border-collapse: collapse;
    }
    /* 单元格：垂直顶格，内边距优化，宽度按内容/比例分配 */
    td {
        vertical-align: top; 
        padding: 8px;
        /* 示例：两列平分宽度，可根据实际列数调整 */
        width: 50%; 
    }
    /* 图片：自适应单元格，保持比例 */
    img {
        max-width: 100%;
        height: auto;
    }
    /* 响应式：小屏（如手机）下优化显示 */
    @media (max-width: 768px) {
        td {
            width: 100%; /* 小屏时列垂直堆叠 */
            display: block;
        }
        tr {
            display: block;
            margin-bottom: 15px;
            border: 1px solid #ddd;
        }
    }
</style>





`POST https://ark.cn-beijing.volces.com/api/v3/images/generations` [运行](https://api.volcengine.com/api-explorer/?action=ImageGenerations&groupName=%E5%9B%BE%E7%89%87%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01&tab=2#N4IgTgpgzgDg9gOyhA+gMzmAtgQwC4gBcIArmADYgA0IUAlgF4REgBMA0tSAO74TY4wAayJoc5ZDSxwAJhErEZcEgCMccALTIIMyDiwaALBoAMG1gFYTADlbWuMMHCwwCxQPhmgUTTA-l6Ao2MAw-4CLeYB4tkHBgDOJgE2KgF+KgABygGHxgNf6gPSmgN2egCwegHEegCFugLCagCfKgOhKgGbx-oBFRoBjkYCTkZGA34qA2Ur+gKyugI76gOSagOJO-oDU5oCnpoBHphWA+Ib+gBVKI4Cf2oAr1oBOQf5wAMaATHaAy+b+gJKKgP1+gL-xgFRxY4CABoCEVoBTPv6A9maAj7b+gKGxgA3OgHnagNxygJJy-peAuyH+gNyugEbpgFgJgHH4wBjfoBvQOygAY5QAz2tkZoBLfUAQjqAQmtAIoagAIEp6AZXlAHBygC51c7+QAUsUNAPjuD38gHSzQKAOYzADMB52y6xagAlTQA55oBSELR0UA2DaAF7V-IAXU0xgB9FQDuioAvIMA9OaAbz1AM8GI0AHJqAAn1soB-PUAS5GAeASKmz-IAAAPW-kAs8qAEB1-IBA80AL4GMlr+QBc+oBUfUagDwVQA2aiAAL5AA)
本文介绍图片生成模型如 Seedream 4.5 的调用 API ，包括输入输出参数，取值范围，注意事项等信息，供您使用接口时查阅字段含义。

**不同模型支持的图片生成能力简介**

* **doubao\-seedream\-4.5==^new^==** **、doubao\-seedream\-4.0**
   * 生成组图（组图：基于您输入的内容，生成的一组内容关联的图片；需配置 **sequential_image_generation ** 为`auto` **）** 
      * 多图生组图，根据您输入的 **++多张参考图片（2\-14）++ **  +++文本提示词++ 生成一组内容关联的图片（输入的参考图数量+最终生成的图片数量≤15张）。
      * 单图生组图，根据您输入的 ++单张参考图片+文本提示词++ 生成一组内容关联的图片（最多生成14张图片）。
      * 文生组图，根据您输入的 ++文本提示词++ 生成一组内容关联的图片（最多生成15张图片）。
   * 生成单图（配置 **sequential_image_generation ** 为`disabled` **）** 
      * 多图生图，根据您输入的 **++多张参考图片（2\-14）++ **  +++文本提示词++ 生成单张图片。
      * 单图生图，根据您输入的 ++单张参考图片+文本提示词++ 生成单张图片。
      * 文生图，根据您输入的 ++文本提示词++ 生成单张图片。
* **doubao\-seedream\-3.0\-t2i**
   * 文生图，根据您输入的 ++文本提示词++ 生成单张图片。
* **doubao\-seededit\-** **3.0** **\-i2i**
   * 图生图，根据您输入的 ++单张参考图片+文本提示词++ 生成单张图片。

&nbsp;

```mixin-react
return (<Tabs>
<Tabs.TabPane title="快速入口" key="oOTdY3Sn"><RenderMd content={` [ ](#)[体验中心](https://console.volcengine.com/ark/region:ark+cn-beijing/experience/vision?type=GenImage)       <span>![图片](https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_2abecd05ca2779567c6d32f0ddc7874d.png =20x) </span>[模型列表](https://www.volcengine.com/docs/82379/1330310#%E5%9B%BE%E7%89%87%E7%94%9F%E6%88%90%E8%83%BD%E5%8A%9B)       <span>![图片](https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_a5fdd3028d35cc512a10bd71b982b6eb.png =20x) </span>[模型计费](https://www.volcengine.com/docs/82379/1544106#.5Zu-54mH55Sf5oiQ5qih5Z6L)       <span>![图片](https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_afbcf38bdec05c05089d5de5c3fd8fc8.png =20x) </span>[API Key](https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey?apikey=%7B%7D)
 <span>![图片](https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_57d0bca8e0d122ab1191b40101b5df75.png =20x) </span>[调用教程](https://www.volcengine.com/docs/82379/1548482)       <span>![图片](https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_f45b5cd5863d1eed3bc3c81b9af54407.png =20x) </span>[接口文档](https://www.volcengine.com/docs/82379/1666945)       <span>![图片](https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_1609c71a747f84df24be1e6421ce58f0.png =20x) </span>[常见问题](https://www.volcengine.com/docs/82379/1359411)       <span>![图片](https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_bef4bc3de3535ee19d0c5d6c37b0ffdd.png =20x) </span>[开通模型](https://console.volcengine.com/ark/region:ark+cn-beijing/openManagement?LLM=%7B%7D&OpenTokenDrawer=false)
`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="鉴权说明" key="bCgTrLVs"><RenderMd content={`本接口仅支持 API Key 鉴权，请在 [获取 API Key](https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey) 页面，获取长效 API Key。
`}></RenderMd></Tabs.TabPane></Tabs>);
```


---


<span id="7thx2dVa"></span>
## 请求参数 
<span id="BFVUvDi6"></span>
### 请求体

---


**model** `string` %%require%%
本次请求使用模型的 [Model ID](https://www.volcengine.com/docs/82379/1513689) 或[推理接入点](https://www.volcengine.com/docs/82379/1099522) (Endpoint ID)。

---


**prompt ** `string` %%require%%
用于生成图像的提示词，支持中英文。（查看提示词指南：[Seedream 4.0](https://www.volcengine.com/docs/82379/1829186) 、[Seedream 3.0](https://www.volcengine.com/docs/82379/1795150)）
建议不超过300个汉字或600个英文单词。字数过多信息容易分散，模型可能因此忽略细节，只关注重点，造成图片缺失部分元素。

---


**image** `string/array` 
> doubao\-seededit\-3.0\-t2i 不支持该参数

输入的图片信息，支持 URL 或 Base64 编码。其中，doubao\-seedream\-4.5、doubao\-seedream\-4.0 支持单图或多图输入（[查看多图融合示例](https://www.volcengine.com/docs/82379/1824121#%E5%A4%9A%E5%9B%BE%E8%9E%8D%E5%90%88%EF%BC%88%E5%A4%9A%E5%9B%BE%E8%BE%93%E5%85%A5%E5%8D%95%E5%9B%BE%E8%BE%93%E5%87%BA%EF%BC%89)），doubao\-seededit\-3.0\-i2i 仅支持单图输入。

* 图片URL：请确保图片URL可被访问。
* Base64编码：请遵循此格式`data:image/<图片格式>;base64,<Base64编码>`。注意 `<图片格式>` 需小写，如 `data:image/png;base64,<base64_image>`。

:::tip

* 传入图片需要满足以下条件：
   * 图片格式：jpeg、png（doubao\-seedream\-4.5、doubao\-seedream\-4.0 模型新增支持 webp、bmp、tiff、gif 格式**==^new^==**）
   * 宽高比（宽/高）范围：
      * [1/16, 16] (适用模型：doubao\-seedream\-4.5、doubao\-seedream\-4.0）
      * [1/3, 3] (适用模型：doubao\-seededit\-3.0\-t2i、doubao\-seededit\-3.0\-i2i）
   * 宽高长度（px） \> 14
   * 大小：不超过 10MB
   * 总像素：不超过 `6000×6000` px
* doubao\-seedream\-4.5、doubao\-seedream\-4.0 最多支持传入 14 张参考图。


:::
---


**size **  `string` 

```mixin-react
return (<Tabs>
<Tabs.TabPane title="doubao-seedream-4.5" key="BMB6AP1M"><RenderMd content={`指定生成图像的尺寸信息，支持以下两种方式，不可混用。

* 方式 1 | 指定生成图像的分辨率，并在prompt中用自然语言描述图片宽高比、图片形状或图片用途，最终由模型判断生成图片的大小。
   * 可选值：\`2K\`、\`4K\`
* 方式 2 | 指定生成图像的宽高像素值：
   * 默认值：\`2048x2048\`
   * 总像素取值范围：[\`2560x1440=3686400\`, \`4096x4096=16777216\`] 
   * 宽高比取值范围：[1/16, 16]

:::tip
采用方式 2 时，需同时满足总像素取值范围和宽高比取值范围。其中，总像素是对宽度和高度的像素乘积限制，而不是对宽度或高度的单独值进行限制。

* **有效示例**：\`3750x1250\`

总像素值 3750x1250=4687500，符合 [3686400, 16777216] 的区间要求；宽高比 3750/1250=3，符合 [1/16, 16] 的区间要求，故该示例值有效。

* **无效示例**：\`1500x1500\`

总像素值 1500x1500=2250000，未达到 3686400 的最低要求；宽高 1500/1500=1，虽符合 [1/16, 16] 的区间要求，但因其未同时满足两项限制，故该示例值无效。
:::
推荐的宽高像素值：

|宽高比 |宽高像素值 |
|---|---|
|1:1 |\`2048x2048\` |
|4:3 |\`2304x1728\` |
|3:4 |\`1728x2304\` |
|16:9 |\`2560x1440\` |
|9:16 |\`1440x2560\` |
|3:2 |\`2496x1664\` |
|2:3 |\`1664x2496\` |
|21:9 |\`3024x1296\` |

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="doubao-seedream-4.0" key="kghENadO"><RenderMd content={`指定生成图像的尺寸信息，支持以下两种方式，不可混用。

* 方式 1 | 指定生成图像的分辨率，并在prompt中用自然语言描述图片宽高比、图片形状或图片用途，最终由模型判断生成图片的大小。
   * 可选值：\`1K\`、\`2K\`、\`4K\`
* 方式 2 | 指定生成图像的宽高像素值：
   * 默认值：\`2048x2048\`
   * 总像素取值范围：[\`1280x720=921600\`, \`4096x4096=16777216\`] 
   * 宽高比取值范围：[1/16, 16]

:::tip
采用方式 2 时，需同时满足总像素取值范围和宽高比取值范围。其中，总像素是对宽度和高度的像素乘积限制，而不是对宽度或高度的单独值进行限制。

* **有效示例**：\`1600x600\`

总像素值 1600x600=960000，符合 [921600, 16777216] 的区间要求；宽高比 1600/600=8/3，符合 [1/16, 16] 的区间要求，故该示例值有效。

* **无效示例**：\`800x800\`

总像素值 800x800=640000，未达到 921600 的最低要求；宽高 800/800=1，虽符合 [1/16, 16] 的区间要求，但因其未同时满足两项限制，故该示例值无效。
:::
推荐的宽高像素值：

|宽高比 |宽高像素值 |
|---|---|
|1:1 |\`2048x2048\` |
|4:3 |\`2304x1728\` |
|3:4 |\`1728x2304\` |
|16:9 |\`2560x1440\` |
|9:16 |\`1440x2560\` |
|3:2 |\`2496x1664\` |
|2:3 |\`1664x2496\` |
|21:9 |\`3024x1296\` |

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="doubao-seedream-3.0-t2i" key="MKsftGMr"><RenderMd content={`指定生成图像的宽高像素值。

* 默认值：\`1024x1024\`
* 总像素取值范围： [\`512x512\`, \`2048x2048\`] 

推荐的宽高像素值：

|宽高比 |宽高像素值 |
|---|---|
|1:1 |\`1024x1024\` |
|4:3 |\`1152x864\` |
|3:4 |\`864x1152\` |
|16:9 |\`1280x720\` |
|9:16 |\`720x1280\` |
|3:2 |\`1248x832\` |
|2:3 |\`832x1248\` |
|21:9 |\`1512x648\` |

`}></RenderMd></Tabs.TabPane>
<Tabs.TabPane title="doubao-seededit-3.0-i2i" key="dUuqsxPhNL"><RenderMd content={`指定生成图像的宽高像素值。**当前仅支持 adaptive。** 

* adaptive。将您的输入图片尺寸与下表中的尺寸进行对比，选择最接近的，作为输出图片的尺寸。具体而言，会按顺序从可选比例中，选取与原图宽高比**差值最小**的**第一个**，作为生成图片的比例。
* 预设的高宽像素


|宽/高 |宽 |高 |
|---|---|---|
|0.33 |512 |1536 |
|0.35 |544 |1536 |
|0.38 |576 |1536 |
|0.4 |608 |1536 |
|0.42 |640 |1536 |
|0.47 |640 |1376 |
|0.51 |672 |1312 |
|0.55 |704 |1280 |
|0.56 |736 |1312 |
|0.6 |768 |1280 |
|0.63 |768 |1216 |
|0.66 |800 |1216 |
|0.67 |832 |1248 |
|0.7 |832 |1184 |
|0.72 |832 |1152 |
|0.75 |864 |1152 |
|0.78 |896 |1152 |
|0.82 |896 |1088 |
|0.85 |928 |1088 |
|0.88 |960 |1088 |
|0.91 |992 |1088 |
|0.94 |1024 |1088 |
|0.97 |1024 |1056 |
|1 |1024 |1024 |
|1.06 |1056 |992 |
|1.1 |1088 |992 |
|1.17 |1120 |960 |
|1.24 |1152 |928 |
|1.29 |1152 |896 |
|1.33 |1152 |864 |
|1.42 |1184 |832 |
|1.46 |1216 |832 |
|1.5 |1248 |832 |
|1.56 |1248 |800 |
|1.62 |1248 |768 |
|1.67 |1280 |768 |
|1.74 |1280 |736 |
|1.82 |1280 |704 |
|1.78 |1312 |736 |
|1.86 |1312 |704 |
|1.95 |1312 |672 |
|2 |1344 |672 |
|2.05 |1376 |672 |
|2.1 |1408 |672 |
|2.2 |1408 |640 |
|2.25 |1440 |640 |
|2.3 |1472 |640 |
|2.35 |1504 |640 |
|2.4 |1536 |640 |
|2.53 |1536 |608 |
|2.67 |1536 |576 |
|2.82 |1536 |544 |
|3 |1536 |512 |

`}></RenderMd></Tabs.TabPane></Tabs>);
```


---


**seed** `integer`  `默认值 -1`
> 仅 doubao\-seedream\-3.0\-t2i、doubao\-seededit\-3.0\-i2i 支持该参数

随机数种子，用于控制模型生成内容的随机性。取值范围为 [\-1, 2147483647]。
:::warning

* 相同的请求下，模型收到不同的seed值，如：不指定seed值或令seed取值为\-1（会使用随机数替代）、或手动变更seed值，将生成不同的结果。
* 相同的请求下，模型收到相同的seed值，会生成类似的结果，但不保证完全一致。


:::
---


**sequential_image_generation** `string` `默认值 disabled`
> 仅 doubao\-seedream\-4.5、doubao\-seedream\-4.0 支持该参数 | [查看组图输出示例](https://www.volcengine.com/docs/82379/1824121?lang=zh#%E7%BB%84%E5%9B%BE%E8%BE%93%E5%87%BA%EF%BC%88%E5%A4%9A%E5%9B%BE%E8%BE%93%E5%87%BA%EF%BC%89)

控制是否关闭组图功能。
:::tip
组图：基于您输入的内容，生成的一组内容关联的图片。

:::
* `auto`：自动判断模式，模型会根据用户提供的提示词自主判断是否返回组图以及组图包含的图片数量。
* `disabled`：关闭组图功能，模型只会生成一张图。


---


**sequential_image_generation_options ** `object`
> 仅 doubao\-seedream\-4.5、doubao\-seedream\-4.0 支持该参数

组图功能的配置。仅当 **sequential_image_generation ** 为 `auto` 时生效。

属性

---


sequential_image_generation_options.**max_images **  ** ** `integer` `默认值 15`
指定本次请求，最多可生成的图片数量。

* 取值范围： [1, 15]

:::tip
实际可生成的图片数量，除受到 **max_images ** 影响外 **，** 还受到输入的参考图数量影响。**输入的参考图数量+最终生成的图片数量≤15张**。

:::

---


**stream**  `Boolean` `默认值 false`
> 仅 doubao\-seedream\-4.5、doubao\-seedream\-4.0 支持该参数 | [查看流式输出示例](https://www.volcengine.com/docs/82379/1824121#%E6%B5%81%E5%BC%8F%E8%BE%93%E5%87%BA)

控制是否开启流式输出模式。

* `false`：非流式输出模式，等待所有图片全部生成结束后再一次性返回所有信息。
* `true`：流式输出模式，即时返回每张图片输出的结果。在生成单图和组图的场景下，流式输出模式均生效。


---


**guidance_scale **  `Float` 
> doubao\-seedream\-3.0\-t2i 默认值 2.5
> doubao\-seededit\-3.0\-i2i 默认值 5.5
> doubao\-seedream\-4.5、doubao\-seedream\-4.0 不支持

模型输出结果与prompt的一致程度，生成图像的自由度，又称为文本权重；值越大，模型自由度越小，与用户输入的提示词相关性越强。
取值范围：[`1`, `10`] 。

---


**response_format** `string` `默认值 url`
指定生成图像的返回格式。
生成的图片为 jpeg 格式，支持以下两种返回方式：

* `url`：返回图片下载链接；**链接在图片生成后24小时内有效，请及时下载图片。** 
* `b64_json`：以 Base64 编码字符串的 JSON 格式返回图像数据。


---


**watermark**  `Boolean` `默认值 true`
是否在生成的图片中添加水印。

* `false`：不添加水印。
* `true`：在图片右下角添加“AI生成”字样的水印标识。


---


**optimize_prompt_options==^new^==** ** ** `object` 
> 仅 doubao\-seedream\-4.5（当前仅支持 `standard` 模式）、doubao\-seedream\-4.0 支持该参数

提示词优化功能的配置。

属性
optimize_prompt_options.**mode ** `string`  `默认值 standard`
设置提示词优化功能使用的模式。

* `standard`：标准模式，生成内容的质量更高，耗时较长。
* `fast`：快速模式，生成内容的耗时更短，质量一般。


---


&nbsp;
<span id="7P96iLnc"></span>
## 响应参数
<span id="Hrya4y9k"></span>
### 流式响应参数
请参见[文档](https://www.volcengine.com/docs/82379/1824137?lang=zh)。
&nbsp;
<span id="1AxnwQZN"></span>
### 非流式响应参数

---


**model** `string`
本次请求使用的模型 ID （`模型名称-版本`）。

---


**created** `integer`
本次请求创建时间的 Unix 时间戳（秒）。

---


**data** `array`
输出图像的信息。
:::tip
doubao\-seedream\-4.5、doubao\-seedream\-4.0 模型生成组图场景下，组图生成过程中某张图生成失败时：

* 若失败原因为审核不通过：仍会继续请求下一个图片生成任务，即不影响同请求内其他图片的生成流程。
* 若失败原因为内部服务异常（500）：不会继续请求下一个图片生成任务。


:::
可能类型
图片信息 `object`
生成成功的图片信息。

属性
data.**url ** `string`
图片的 url 信息，当 **response_format ** 指定为 `url` 时返回。该链接将在生成后 **24 小时内失效**，请务必及时保存图像。

---


data.**b64_json** `string`
图片的 base64 信息，当 **response_format ** 指定为 `b64_json` 时返回。

---


data.**size** `string`
> 仅 doubao\-seedream\-4.5、doubao\-seedream\-4.0 支持该字段。

图像的宽高像素值，格式 `<宽像素>x<高像素>`，如`2048×2048`。


---


错误信息 `object`
某张图片生成失败，错误信息。

属性
data.**error** `object`
错误信息结构体。

属性

---


data.error.**code**
某张图片生成错误的错误码，请参见[错误码](https://www.volcengine.com/docs/82379/1299023)。

---


data.error.**message**
某张图片生成错误的提示信息。




---


**usage** `object`
本次请求的用量信息。

属性

---


usage.**generated_images ** `integer`
模型成功生成的图片张数，不包含生成失败的图片。
仅对成功生成图片按张数进行计费。

---


usage.**output_tokens** `integer`
模型生成的图片花费的 token 数量。
计算逻辑为：计算 `sum(图片长*图片宽)/256` ，然后取整。

---


usage.**total_tokens** `integer`
本次请求消耗的总 token 数量。
当前不计算输入 token，故与 **output_tokens** 值一致。

**error**  `object`
本次请求，如发生错误，对应的错误信息。 

属性

---


error.**code** `string` 
请参见[错误码](https://www.volcengine.com/docs/82379/1299023)。

---


error.**message** `string`
错误提示信息

&nbsp;


