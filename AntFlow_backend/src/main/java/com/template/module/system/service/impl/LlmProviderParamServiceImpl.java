package com.template.module.system.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.module.system.entity.LlmProviderParam;
import com.template.module.system.mapper.LlmProviderParamMapper;
import com.template.module.system.service.LlmProviderParamService;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class LlmProviderParamServiceImpl extends ServiceImpl<LlmProviderParamMapper, LlmProviderParam>
    implements LlmProviderParamService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveProviderParams(Long providerId, Map<String, String> params) {
        if (providerId == null) {
            return;
        }
        this.lambdaUpdate().eq(LlmProviderParam::getProviderId, providerId).remove();
        if (CollectionUtils.isEmpty(params)) {
            return;
        }
        List<LlmProviderParam> entities = params.entrySet().stream()
            .filter(entry -> entry.getKey() != null && StringUtils.hasText(entry.getValue()))
            .map(entry -> {
                LlmProviderParam param = new LlmProviderParam();
                param.setProviderId(providerId);
                param.setParamKey(entry.getKey());
                param.setParamValue(entry.getValue());
                return param;
            })
            .collect(Collectors.toList());
        if (!entities.isEmpty()) {
            this.saveBatch(entities);
        }
    }

    @Override
    public Map<String, String> listProviderParams(Long providerId) {
        if (providerId == null) {
            return Collections.emptyMap();
        }
        return this.lambdaQuery()
            .eq(LlmProviderParam::getProviderId, providerId)
            .list()
            .stream()
            .collect(Collectors.toMap(LlmProviderParam::getParamKey, LlmProviderParam::getParamValue, (a, b) -> b, LinkedHashMap::new));
    }

    @Override
    public Map<Long, Map<String, String>> listProviderParams(Collection<Long> providerIds) {
        if (CollectionUtils.isEmpty(providerIds)) {
            return Collections.emptyMap();
        }
        return this.lambdaQuery()
            .in(LlmProviderParam::getProviderId, providerIds)
            .list()
            .stream()
            .collect(Collectors.groupingBy(
                LlmProviderParam::getProviderId,
                Collectors.toMap(
                    LlmProviderParam::getParamKey,
                    LlmProviderParam::getParamValue,
                    (existing, replace) -> replace,
                    LinkedHashMap::new
                )
            ));
    }
}
