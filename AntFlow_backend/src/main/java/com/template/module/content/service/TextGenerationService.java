package com.template.module.content.service;

import com.template.module.content.client.DoubaoTextClient;
import com.template.module.content.client.GlmTextClient;
import com.template.module.content.client.KimiTextClient;
import com.template.module.content.client.QwenTextClient;
import com.template.module.content.client.TextGenerationRequest;
import com.template.module.content.client.TextGenerationResult;
import com.template.module.content.entity.ContentModule;
import com.template.module.content.enums.ContentApiVendor;
import com.template.module.system.entity.LlmProvider;
import com.template.module.system.service.LlmProviderService;
import java.util.Collections;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class TextGenerationService {

    private final LlmProviderService llmProviderService;
    private final DoubaoTextClient doubaoTextClient;
    private final KimiTextClient kimiTextClient;
    private final QwenTextClient qwenTextClient;
    private final GlmTextClient glmTextClient;

    public Optional<String> generateArticle(ContentModule module, String prompt) {
        if (!StringUtils.hasText(prompt)) {
            return Optional.empty();
        }
        ContentApiVendor vendor = ContentApiVendor.fromCode(module.getApiVendor());
        if (vendor == null) {
            vendor = ContentApiVendor.DOUBAO;
        }
        LlmProvider provider = llmProviderService.findActiveProvider(vendor.getCode(), module.getApiName()).orElse(null);
        if (provider == null) {
            log.warn("No provider configured for vendor {}", vendor.getCode());
            return Optional.empty();
        }
        if (!StringUtils.hasText(provider.getApiKey())) {
            log.warn("Provider {} missing apiKey", provider.getProviderCode());
            return Optional.empty();
        }
        TextGenerationRequest request = TextGenerationRequest.builder()
            .prompt(prompt)
            .apiKey(provider.getApiKey())
            .baseUrl(provider.getBaseUrl())
            .model(provider.getModelName())
            .params(provider.getApiParams())
            .build();

        TextGenerationResult result = switch (vendor) {
            case DOUBAO -> doubaoTextClient.generate(request);
            case KIMI -> kimiTextClient.generate(request);
            case QWEN -> qwenTextClient.generate(request);
            case GLM -> glmTextClient.generate(request);
            case OPENAI -> null;
            default -> null;
        };
        if (result == null) {
            return Optional.empty();
        }
        if (result.isSuccess() && StringUtils.hasText(result.getContent())) {
            return Optional.of(result.getContent().trim());
        }
        log.warn("Text generation failed for vendor {}: {}", vendor.getCode(), result.getErrorMessage());
        return Optional.empty();
    }
}
