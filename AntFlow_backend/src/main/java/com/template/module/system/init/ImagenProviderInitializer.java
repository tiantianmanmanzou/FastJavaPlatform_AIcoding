package com.template.module.system.init;

import com.template.common.constants.CommonConstants;
import com.template.module.content.config.ImagenProperties;
import com.template.module.system.entity.LlmProvider;
import com.template.module.system.service.LlmProviderService;
import jakarta.annotation.PostConstruct;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
@Slf4j
public class ImagenProviderInitializer {

    private final ImagenProperties imagenProperties;
    private final LlmProviderService llmProviderService;

    @PostConstruct
    @Transactional(rollbackFor = Exception.class)
    public void bootstrapProvider() {
        if (!StringUtils.hasText(imagenProperties.getProviderCode())) {
            return;
        }
        LlmProvider existing = llmProviderService.lambdaQuery()
            .eq(LlmProvider::getProviderCode, imagenProperties.getProviderCode())
            .last("limit 1")
            .one();
        boolean enabled = imagenProperties.isEnabled();
        if (existing == null) {
            LlmProvider provider = new LlmProvider();
            provider.setProviderCode(imagenProperties.getProviderCode());
            provider.setProviderName("Google Imagen");
            provider.setProviderType("IMAGE_GENERATION");
            provider.setVendor("GOOGLE");
            provider.setModelName(imagenProperties.getModel());
            provider.setBaseUrl(imagenProperties.getEndpoint());
            provider.setApiKey(imagenProperties.getApiKey());
            provider.setApiVersion(null);
            provider.setStatus(enabled ? CommonConstants.STATUS_ENABLED : CommonConstants.STATUS_DISABLED);
            provider.setDefaultFlag(1);
            provider.setConcurrencyLimit(5);
            provider.setTimeoutSeconds(30);
            provider.setCapabilityTags("IMAGEN,GOOGLE,IMAGE");
            provider.setDescription("Google Imagen 接入配置");
            llmProviderService.save(provider);
            log.info("[LlmProvider] 初始化 Google Imagen 配置 providerCode={}", provider.getProviderCode());
        } else {
            boolean changed = false;
            Integer targetStatus = enabled ? CommonConstants.STATUS_ENABLED : CommonConstants.STATUS_DISABLED;
            if (!Objects.equals(existing.getProviderName(), "Google Imagen")) {
                existing.setProviderName("Google Imagen");
                changed = true;
            }
            if (!Objects.equals(existing.getVendor(), "GOOGLE")) {
                existing.setVendor("GOOGLE");
                changed = true;
            }
            if (!Objects.equals(existing.getProviderType(), "IMAGE_GENERATION")) {
                existing.setProviderType("IMAGE_GENERATION");
                changed = true;
            }
            if (!Objects.equals(existing.getModelName(), imagenProperties.getModel())) {
                existing.setModelName(imagenProperties.getModel());
                changed = true;
            }
            if (!Objects.equals(existing.getBaseUrl(), imagenProperties.getEndpoint())) {
                existing.setBaseUrl(imagenProperties.getEndpoint());
                changed = true;
            }
            if (!Objects.equals(existing.getStatus(), targetStatus)) {
                existing.setStatus(targetStatus);
                changed = true;
            }
            if (changed) {
                llmProviderService.updateById(existing);
                log.info("[LlmProvider] 同步 Google Imagen 配置 providerCode={}", existing.getProviderCode());
            }
        }
    }
}
