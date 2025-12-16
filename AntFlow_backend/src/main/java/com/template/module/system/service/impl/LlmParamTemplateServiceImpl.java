package com.template.module.system.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.template.common.constants.CommonConstants;
import com.template.module.system.dto.LlmParamOptionVO;
import com.template.module.system.dto.LlmParamTemplateVO;
import com.template.module.system.entity.LlmModelParamTemplate;
import com.template.module.system.mapper.LlmModelParamTemplateMapper;
import com.template.module.system.service.LlmParamTemplateService;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class LlmParamTemplateServiceImpl extends ServiceImpl<LlmModelParamTemplateMapper, LlmModelParamTemplate>
    implements LlmParamTemplateService {

    private final ObjectMapper objectMapper;

    @Override
    public List<LlmModelParamTemplate> findTemplates(String vendor, String generationType) {
        if (!StringUtils.hasText(vendor) || !StringUtils.hasText(generationType)) {
            return Collections.emptyList();
        }
        return this.lambdaQuery()
            .eq(LlmModelParamTemplate::getVendor, vendor)
            .eq(LlmModelParamTemplate::getGenerationType, generationType)
            .eq(LlmModelParamTemplate::getStatus, CommonConstants.STATUS_ENABLED)
            .orderByAsc(LlmModelParamTemplate::getSortOrder)
            .orderByAsc(LlmModelParamTemplate::getId)
            .list();
    }

    @Override
    public List<LlmParamTemplateVO> findTemplateVOs(String vendor, String generationType) {
        return findTemplates(vendor, generationType).stream()
            .map(this::toVO)
            .collect(Collectors.toList());
    }

    private LlmParamTemplateVO toVO(LlmModelParamTemplate template) {
        LlmParamTemplateVO vo = new LlmParamTemplateVO();
        BeanUtils.copyProperties(template, vo);
        vo.setOptions(parseOptions(template.getOptions()));
        return vo;
    }

    private List<LlmParamOptionVO> parseOptions(String json) {
        if (!StringUtils.hasText(json)) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<LlmParamOptionVO>>() { });
        } catch (Exception e) {
            log.warn("Failed to parse llm param options {}", json, e);
            return Collections.emptyList();
        }
    }
}
