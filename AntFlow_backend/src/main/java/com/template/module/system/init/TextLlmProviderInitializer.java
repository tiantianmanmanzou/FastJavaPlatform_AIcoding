package com.template.module.system.init;

import com.template.common.constants.CommonConstants;
import com.template.module.system.entity.LlmProvider;
import com.template.module.system.service.LlmProviderService;
import jakarta.annotation.PostConstruct;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class TextLlmProviderInitializer {

    private final LlmProviderService llmProviderService;

    @PostConstruct
    @Transactional(rollbackFor = Exception.class)
    public void initDefaults() {
        registerProvider("doubao-text-default", "火山豆包·通用写作", "DOUBAO",
            "https://ark.cn-beijing.volces.com/api/v3/chat/completions", "ep-general-v1", 1);
        registerProvider("kimi-text-default", "Kimi 文案助手", "KIMI",
            "https://api.moonshot.cn/v1/chat/completions", "kimi-k2-turbo", 0);
        registerProvider("qwen-text-default", "千问 Qwen 生成", "QWEN",
            "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", "qwen2.5-72b-instruct", 0);
        registerProvider("glm-text-default", "智谱 GLM", "GLM",
            "https://open.bigmodel.cn/api/paas/v4/chat/completions", "glm-4.6", 0);
    }

    private void registerProvider(String code, String name, String vendor, String baseUrl, String model, int defaultFlag) {
        LlmProvider existing = llmProviderService.lambdaQuery()
            .eq(LlmProvider::getProviderCode, code)
            .last("limit 1")
            .one();
        if (existing == null) {
            LlmProvider provider = new LlmProvider();
            provider.setProviderCode(code);
            provider.setProviderName(name);
            provider.setProviderType("TEXT_GENERATION");
            provider.setVendor(vendor);
            provider.setModelName(model);
            provider.setBaseUrl(baseUrl);
            provider.setStatus(CommonConstants.STATUS_DISABLED);
            provider.setDefaultFlag(defaultFlag);
            provider.setConcurrencyLimit(5);
            provider.setTimeoutSeconds(60);
            provider.setCapabilityTags("TEXT,LLM");
            provider.setDescription("默认初始化的文本大模型配置，填写 API Key 后启用");
            llmProviderService.save(provider);
            log.info("[LlmProvider] 初始化文本模型配置 providerCode={}", code);
            return;
        }
        boolean changed = false;
        if (!Objects.equals(existing.getProviderName(), name)) {
            existing.setProviderName(name);
            changed = true;
        }
        if (!Objects.equals(existing.getVendor(), vendor)) {
            existing.setVendor(vendor);
            changed = true;
        }
        if (!Objects.equals(existing.getProviderType(), "TEXT_GENERATION")) {
            existing.setProviderType("TEXT_GENERATION");
            changed = true;
        }
        if (baseUrl != null && !Objects.equals(existing.getBaseUrl(), baseUrl)) {
            existing.setBaseUrl(baseUrl);
            changed = true;
        }
        if (model != null && !Objects.equals(existing.getModelName(), model)) {
            existing.setModelName(model);
            changed = true;
        }
        if (existing.getDefaultFlag() == null || existing.getDefaultFlag() != defaultFlag) {
            existing.setDefaultFlag(defaultFlag);
            changed = true;
        }
        if (changed) {
            llmProviderService.updateById(existing);
            log.info("[LlmProvider] 同步文本模型配置 providerCode={}", code);
        }
    }
}
