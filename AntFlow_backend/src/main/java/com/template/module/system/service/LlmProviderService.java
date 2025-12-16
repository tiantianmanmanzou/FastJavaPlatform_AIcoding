package com.template.module.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.common.response.PageResult;
import com.template.module.system.dto.LlmProviderDetailVO;
import com.template.module.system.dto.LlmProviderQueryRequest;
import com.template.module.system.dto.LlmProviderRequest;
import com.template.module.system.dto.LlmProviderVO;
import com.template.module.system.entity.LlmProvider;
import java.util.List;
import java.util.Optional;

public interface LlmProviderService extends IService<LlmProvider> {

    PageResult<LlmProviderVO> pageProviders(LlmProviderQueryRequest request);

    List<LlmProviderVO> listActiveProviders();

    LlmProviderDetailVO getProvider(Long id);

    LlmProviderDetailVO createProvider(LlmProviderRequest request);

    LlmProviderDetailVO updateProvider(Long id, LlmProviderRequest request);

    void deleteProvider(Long id);

    void markDefault(Long id);

    Optional<LlmProvider> findActiveProvider(String vendorOrCode, String apiName);
}
