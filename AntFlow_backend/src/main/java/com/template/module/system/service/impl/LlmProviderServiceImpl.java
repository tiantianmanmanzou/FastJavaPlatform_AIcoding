package com.template.module.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.constants.CommonConstants;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.response.PageResult;
import com.template.module.system.dto.LlmProviderDetailVO;
import com.template.module.system.dto.LlmProviderQueryRequest;
import com.template.module.system.dto.LlmProviderRequest;
import com.template.module.system.dto.LlmProviderVO;
import com.template.module.system.entity.LlmModelParamTemplate;
import com.template.module.system.entity.LlmProvider;
import com.template.module.system.mapper.LlmProviderMapper;
import com.template.module.system.service.LlmParamTemplateService;
import com.template.module.system.service.LlmProviderParamService;
import com.template.module.system.service.LlmProviderService;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class LlmProviderServiceImpl extends ServiceImpl<LlmProviderMapper, LlmProvider> implements LlmProviderService {

    private static final int DEFAULT_CONCURRENCY_LIMIT = 5;
    private static final int DEFAULT_TIMEOUT_SECONDS = 30;

    private final LlmProviderParamService providerParamService;
    private final LlmParamTemplateService paramTemplateService;

    @Override
    public PageResult<LlmProviderVO> pageProviders(LlmProviderQueryRequest request) {
        Page<LlmProvider> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<LlmProvider> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(request.getKeyword())) {
            wrapper.and(qw -> qw.like(LlmProvider::getProviderName, request.getKeyword())
                .or().like(LlmProvider::getProviderCode, request.getKeyword())
                .or().like(LlmProvider::getModelName, request.getKeyword()));
        }
        if (request.getStatus() != null) {
            wrapper.eq(LlmProvider::getStatus, request.getStatus());
        }
        if (StringUtils.hasText(request.getProviderType())) {
            wrapper.eq(LlmProvider::getProviderType, request.getProviderType());
        }
        wrapper.orderByDesc(LlmProvider::getUpdateTime);
        this.page(page, wrapper);
        Map<Long, Map<String, String>> paramsMap = providerParamService.listProviderParams(
            page.getRecords().stream().map(LlmProvider::getId).collect(Collectors.toList()));
        List<LlmProviderVO> records = page.getRecords().stream()
            .map(provider -> toVO(provider, paramsMap.get(provider.getId())))
            .collect(Collectors.toList());
        return PageResult.of(records, page.getTotal(), page.getCurrent(), page.getSize());
    }

    @Override
    public List<LlmProviderVO> listActiveProviders() {
        List<LlmProvider> providers = this.lambdaQuery()
            .eq(LlmProvider::getStatus, CommonConstants.STATUS_ENABLED)
            .orderByDesc(LlmProvider::getDefaultFlag)
            .orderByDesc(LlmProvider::getUpdateTime)
            .list();
        Map<Long, Map<String, String>> paramsMap = providerParamService.listProviderParams(
            providers.stream().map(LlmProvider::getId).collect(Collectors.toList()));
        return providers.stream()
            .map(provider -> toVO(provider, paramsMap.get(provider.getId())))
            .collect(Collectors.toList());
    }

    @Override
    public LlmProviderDetailVO getProvider(Long id) {
        LlmProvider provider = getById(id);
        if (provider == null) {
            throw new BusinessException(ErrorCode.LLM_PROVIDER_NOT_FOUND);
        }
        Map<String, String> params = providerParamService.listProviderParams(id);
        return toDetailVO(provider, params);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LlmProviderDetailVO createProvider(LlmProviderRequest request) {
        ensureCodeUnique(request.getProviderCode(), null);
        LlmProvider provider = new LlmProvider();
        BeanUtils.copyProperties(request, provider);
        applyDefaults(provider);
        Map<String, String> normalizedParams = normalizeParams(request.getApiParams());
        validateTemplateParams(provider, normalizedParams);
        save(provider);
        providerParamService.saveProviderParams(provider.getId(), normalizedParams);
        adjustDefaultFlag(provider);
        Map<String, String> params = providerParamService.listProviderParams(provider.getId());
        return toDetailVO(provider, params);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LlmProviderDetailVO updateProvider(Long id, LlmProviderRequest request) {
        LlmProvider provider = getById(id);
        if (provider == null) {
            throw new BusinessException(ErrorCode.LLM_PROVIDER_NOT_FOUND);
        }
        if (!Objects.equals(provider.getProviderCode(), request.getProviderCode())) {
            ensureCodeUnique(request.getProviderCode(), id);
        }
        String existingApiKey = provider.getApiKey();
        BeanUtils.copyProperties(request, provider);
        if (StringUtils.hasText(request.getApiKey())) {
            provider.setApiKey(request.getApiKey().trim());
        } else {
            provider.setApiKey(existingApiKey);
        }
        applyDefaults(provider);
        Map<String, String> normalizedParams = normalizeParams(request.getApiParams());
        validateTemplateParams(provider, normalizedParams);
        updateById(provider);
        providerParamService.saveProviderParams(provider.getId(), normalizedParams);
        adjustDefaultFlag(provider);
        Map<String, String> params = providerParamService.listProviderParams(provider.getId());
        return toDetailVO(provider, params);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProvider(Long id) {
        boolean removed = removeById(id);
        if (!removed) {
            throw new BusinessException(ErrorCode.LLM_PROVIDER_NOT_FOUND);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markDefault(Long id) {
        LlmProvider provider = getById(id);
        if (provider == null) {
            throw new BusinessException(ErrorCode.LLM_PROVIDER_NOT_FOUND);
        }
        provider.setDefaultFlag(1);
        updateById(provider);
        lambdaUpdate()
            .ne(LlmProvider::getId, id)
            .eq(LlmProvider::getProviderType, provider.getProviderType())
            .set(LlmProvider::getDefaultFlag, 0)
            .update();
    }

    @Override
    public Optional<LlmProvider> findActiveProvider(String vendorOrCode, String apiName) {
        if (!StringUtils.hasText(vendorOrCode)) {
            return Optional.empty();
        }
        LambdaQueryWrapper<LlmProvider> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(LlmProvider::getStatus, CommonConstants.STATUS_ENABLED);
        wrapper.and(qw -> qw.eq(LlmProvider::getVendor, vendorOrCode)
            .or().eq(LlmProvider::getProviderCode, vendorOrCode));
        if (StringUtils.hasText(apiName)) {
            wrapper.and(qw -> qw.eq(LlmProvider::getModelName, apiName)
                .or().eq(LlmProvider::getProviderCode, apiName));
        }
        wrapper.orderByDesc(LlmProvider::getDefaultFlag)
            .orderByDesc(LlmProvider::getUpdateTime)
            .last("limit 1");
        LlmProvider provider = getOne(wrapper);
        if (provider == null && StringUtils.hasText(apiName)) {
            return findActiveProvider(vendorOrCode, null);
        }
        if (provider != null) {
            provider.setApiParams(providerParamService.listProviderParams(provider.getId()));
        }
        return Optional.ofNullable(provider);
    }

    private void ensureCodeUnique(String providerCode, Long excludeId) {
        LambdaQueryWrapper<LlmProvider> wrapper = new LambdaQueryWrapper<LlmProvider>()
            .eq(LlmProvider::getProviderCode, providerCode);
        if (excludeId != null) {
            wrapper.ne(LlmProvider::getId, excludeId);
        }
        long count = this.count(wrapper);
        if (count > 0) {
            throw new BusinessException(ErrorCode.LLM_PROVIDER_CODE_EXISTS);
        }
    }

    private void applyDefaults(LlmProvider provider) {
        if (provider.getStatus() == null) {
            provider.setStatus(CommonConstants.STATUS_DISABLED);
        }
        if (provider.getDefaultFlag() == null) {
            provider.setDefaultFlag(0);
        }
        if (provider.getConcurrencyLimit() == null) {
            provider.setConcurrencyLimit(DEFAULT_CONCURRENCY_LIMIT);
        }
        if (provider.getTimeoutSeconds() == null) {
            provider.setTimeoutSeconds(DEFAULT_TIMEOUT_SECONDS);
        }
    }

    private void adjustDefaultFlag(LlmProvider provider) {
        if (provider.getDefaultFlag() != null && provider.getDefaultFlag() == 1) {
            lambdaUpdate()
                .ne(LlmProvider::getId, provider.getId())
                .eq(LlmProvider::getProviderType, provider.getProviderType())
                .set(LlmProvider::getDefaultFlag, 0)
                .update();
        }
    }

    private Map<String, String> normalizeParams(Map<String, String> rawParams) {
        if (CollectionUtils.isEmpty(rawParams)) {
            return Collections.emptyMap();
        }
        return rawParams.entrySet().stream()
            .filter(entry -> entry.getKey() != null)
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                entry -> entry.getValue() == null ? "" : entry.getValue().trim(),
                (existing, replace) -> replace,
                LinkedHashMap::new
            ));
    }

    private void validateTemplateParams(LlmProvider provider, Map<String, String> params) {
        if (!StringUtils.hasText(provider.getVendor()) || !StringUtils.hasText(provider.getProviderType())) {
            return;
        }
        List<LlmModelParamTemplate> templates = paramTemplateService.findTemplates(provider.getVendor(), provider.getProviderType());
        if (CollectionUtils.isEmpty(templates)) {
            return;
        }
        for (LlmModelParamTemplate template : templates) {
            if (template.getRequired() != null && template.getRequired() == 1) {
                String value = params.get(template.getParamKey());
                if (!StringUtils.hasText(value)) {
                    throw new BusinessException(ErrorCode.BAD_REQUEST, template.getParamLabel() + "为必填项");
                }
            }
        }
    }

    private LlmProviderVO toVO(LlmProvider provider, Map<String, String> params) {
        LlmProviderVO vo = new LlmProviderVO();
        BeanUtils.copyProperties(provider, vo);
        vo.setApiParams(params);
        return vo;
    }

    private LlmProviderDetailVO toDetailVO(LlmProvider provider, Map<String, String> params) {
        LlmProviderDetailVO vo = new LlmProviderDetailVO();
        BeanUtils.copyProperties(provider, vo);
        vo.setApiParams(params);
        return vo;
    }
}
