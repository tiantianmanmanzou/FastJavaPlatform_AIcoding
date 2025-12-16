package com.template.module.system.init;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.template.module.system.entity.LlmModelParamTemplate;
import com.template.module.system.service.LlmParamTemplateService;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class LlmParamTemplateInitializer {

    private final LlmParamTemplateService paramTemplateService;
    private final ObjectMapper objectMapper;

    @PostConstruct
    @Transactional(rollbackFor = Exception.class)
    public void initTemplates() {
        List<LlmModelParamTemplate> defaults = List.of(
            template("OPENAI", "TEXT_GENERATION", "temperature", "温度", "NUMBER", 0, "0 - 2", "0.7",
                null, "控制输出随机性，值越大越发散", 10),
            template("OPENAI", "TEXT_GENERATION", "max_tokens", "最大Tokens", "NUMBER", 0, "例如：4096", "4096",
                null, "限制模型的输出长度", 20),
            template("OPENAI", "TEXT_GENERATION", "presence_penalty", "重复惩罚", "NUMBER", 0, "-2 到 2", "0",
                null, "大于0时会提升新话题概率", 30),
            template("MINIMAX", "IMAGE_GENERATION", "resolution", "分辨率", "SELECT", 0, null, null,
                List.of(
                    Map.of("label", "1024x1024", "value", "1024x1024"),
                    Map.of("label", "768x1024", "value", "768x1024"),
                    Map.of("label", "512x1024", "value", "512x1024")
                ),
                "生成图片的宽高比", 10),
            template("MINIMAX", "IMAGE_GENERATION", "quality", "画质", "SELECT", 0, null, "high",
                List.of(
                    Map.of("label", "高清", "value", "high"),
                    Map.of("label", "标准", "value", "standard")
                ),
                "不同画质渲染速度不同", 20),
            template("MINIMAX", "IMAGE_GENERATION", "seed", "随机种子", "NUMBER", 0, "0 - 4294967295", null,
                null, "相同seed可复现同样画面", 30),
            template("GOOGLE", "REASONING", "temperature", "温度", "NUMBER", 0, "0 - 1", "0.2",
                null, "推理模型默认偏保守", 10),
            template("GOOGLE", "REASONING", "top_k", "Top K", "NUMBER", 0, "1 - 100", "32",
                null, "候选Token数量", 20),
            template("DOUBAO", "TEXT_GENERATION", "temperature", "温度", "NUMBER", 0, "0 - 2", "0.7",
                null, "控制输出的随机程度", 10),
            template("DOUBAO", "TEXT_GENERATION", "max_tokens", "最大Tokens", "NUMBER", 0, "例如：4000", "4000",
                null, "限制返回内容长度", 20),
            template("DOUBAO", "TEXT_GENERATION", "retry_attempts", "重试次数", "NUMBER", 0, "1 - 5", "2",
                null, "调用失败后的最大重试次数", 30),
            template("DOUBAO", "TEXT_GENERATION", "retry_delay_seconds", "重试间隔(秒)", "NUMBER", 0, "1 - 10", "2",
                null, "两次重试之间的等待秒数", 40),
            template("DOUBAO", "TEXT_GENERATION", "request_timeout", "超时时间(秒)", "NUMBER", 0, "30 - 300", "180",
                null, "接口调用超时时间", 50),
            template("DOUBAO", "TEXT_GENERATION", "thinking_type", "推理模式", "SELECT", 0, null, "disabled",
                List.of(
                    Map.of("label", "关闭", "value", "disabled"),
                    Map.of("label", "启用", "value", "enabled")
                ),
                "是否启用推理模式/思考输出", 60),
            template("KIMI", "TEXT_GENERATION", "system_prompt", "系统提示词", "TEXT", 0, "可选", null,
                null, "在用户提示前注入的角色说明", 10),
            template("KIMI", "TEXT_GENERATION", "temperature", "温度", "NUMBER", 0, "0 - 1", "0.6",
                null, "数值越大越活跃", 20),
            template("KIMI", "TEXT_GENERATION", "max_tokens", "最大Tokens", "NUMBER", 0, "例如：4096", "4096",
                null, "限制输出长度", 30),
            template("KIMI", "TEXT_GENERATION", "retry_attempts", "重试次数", "NUMBER", 0, "1 - 5", "2",
                null, "失败后的自动重试次数", 40),
            template("KIMI", "TEXT_GENERATION", "retry_delay_seconds", "重试间隔(秒)", "NUMBER", 0, "1 - 10", "1",
                null, "两次重试之间的等待时间", 50),
            template("QWEN", "TEXT_GENERATION", "temperature", "温度", "NUMBER", 0, "0 - 1", "0.7",
                null, "控制多样性", 10),
            template("QWEN", "TEXT_GENERATION", "top_p", "Top P", "NUMBER", 0, "0 - 1", "0.8",
                null, "概率截断参数", 20),
            template("QWEN", "TEXT_GENERATION", "max_tokens", "最大Tokens", "NUMBER", 0, "例如：4000", "4000",
                null, "限制生成长度", 30),
            template("QWEN", "TEXT_GENERATION", "enable_thinking", "启用Thinking", "SELECT", 0, null, "false",
                List.of(
                    Map.of("label", "关闭", "value", "false"),
                    Map.of("label", "开启", "value", "true")
                ),
                "是否输出思维链", 40),
            template("QWEN", "TEXT_GENERATION", "request_timeout", "超时时间(秒)", "NUMBER", 0, "30 - 600", "180",
                null, "HTTP请求超时时间", 50),
            template("GLM", "TEXT_GENERATION", "system_prompt", "系统提示词", "TEXT", 0, "可选", null,
                null, "在提示前追加的系统说明", 10),
            template("GLM", "TEXT_GENERATION", "temperature", "温度", "NUMBER", 0, "0 - 1", "0.7",
                null, "调节随机性", 20),
            template("GLM", "TEXT_GENERATION", "top_p", "Top P", "NUMBER", 0, "0 - 1", "0.8",
                null, "概率截断参数", 30),
            template("GLM", "TEXT_GENERATION", "max_tokens", "最大Tokens", "NUMBER", 0, "例如：4096", "4096",
                null, "结果最大长度", 40),
            template("GLM", "TEXT_GENERATION", "thinking_type", "Thinking模式", "SELECT", 0, null, "disabled",
                List.of(
                    Map.of("label", "关闭", "value", "disabled"),
                    Map.of("label", "标准", "value", "standard"),
                    Map.of("label", "长思考", "value", "long")
                ),
                "是否开启脑内思考输出", 50),
            template("GLM", "TEXT_GENERATION", "request_timeout", "超时时间(秒)", "NUMBER", 0, "30 - 300", "120",
                null, "HTTP请求超时时间", 60)
        );
        for (LlmModelParamTemplate template : defaults) {
            long count = paramTemplateService.lambdaQuery()
                .eq(LlmModelParamTemplate::getVendor, template.getVendor())
                .eq(LlmModelParamTemplate::getGenerationType, template.getGenerationType())
                .eq(LlmModelParamTemplate::getParamKey, template.getParamKey())
                .count();
            if (count == 0) {
                paramTemplateService.save(template);
            }
        }
    }

    private LlmModelParamTemplate template(
        String vendor,
        String generationType,
        String key,
        String label,
        String inputType,
        int required,
        String placeholder,
        String defaultValue,
        List<Map<String, String>> options,
        String description,
        int sortOrder
    ) {
        LlmModelParamTemplate template = new LlmModelParamTemplate();
        template.setVendor(vendor);
        template.setGenerationType(generationType);
        template.setParamKey(key);
        template.setParamLabel(label);
        template.setInputType(inputType);
        template.setRequired(required);
        template.setPlaceholder(placeholder);
        template.setDefaultValue(defaultValue);
        template.setOptions(toJson(options));
        template.setDescription(description);
        template.setSortOrder(sortOrder);
        template.setStatus(1);
        return template;
    }

    private String toJson(List<Map<String, String>> value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize param template options {}", value, e);
            return null;
        }
    }
}
