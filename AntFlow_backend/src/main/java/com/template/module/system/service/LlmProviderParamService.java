package com.template.module.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.module.system.entity.LlmProviderParam;
import java.util.Collection;
import java.util.Map;

public interface LlmProviderParamService extends IService<LlmProviderParam> {

    void saveProviderParams(Long providerId, Map<String, String> params);

    Map<String, String> listProviderParams(Long providerId);

    Map<Long, Map<String, String>> listProviderParams(Collection<Long> providerIds);
}
