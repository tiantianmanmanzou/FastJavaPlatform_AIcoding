package com.template.module.system.controller;

import com.template.common.response.PageResult;
import com.template.common.response.Result;
import com.template.module.system.dto.LlmParamTemplateVO;
import com.template.module.system.dto.LlmProviderDetailVO;
import com.template.module.system.dto.LlmProviderQueryRequest;
import com.template.module.system.dto.LlmProviderRequest;
import com.template.module.system.dto.LlmProviderVO;
import com.template.module.system.service.LlmProviderService;
import com.template.module.system.service.LlmParamTemplateService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system/llm-providers")
@RequiredArgsConstructor
@Validated
public class LlmProviderController {

    private final LlmProviderService providerService;
    private final LlmParamTemplateService paramTemplateService;

    @GetMapping
    public PageResult<LlmProviderVO> page(LlmProviderQueryRequest request) {
        return providerService.pageProviders(request);
    }

    @GetMapping("/param-templates")
    public Result<List<LlmParamTemplateVO>> paramTemplates(@RequestParam String vendor, @RequestParam("generationType") String generationType) {
        return Result.success(paramTemplateService.findTemplateVOs(vendor, generationType));
    }

    @GetMapping("/active")
    public Result<List<LlmProviderVO>> activeList() {
        return Result.success(providerService.listActiveProviders());
    }

    @GetMapping("/{id:\\d+}")
    public Result<LlmProviderDetailVO> detail(@PathVariable Long id) {
        return Result.success(providerService.getProvider(id));
    }

    @PostMapping
    public Result<LlmProviderDetailVO> create(@Valid @RequestBody LlmProviderRequest request) {
        return Result.success(providerService.createProvider(request));
    }

    @PutMapping("/{id:\\d+}")
    public Result<LlmProviderDetailVO> update(@PathVariable Long id, @Valid @RequestBody LlmProviderRequest request) {
        return Result.success(providerService.updateProvider(id, request));
    }

    @PutMapping("/{id:\\d+}/default")
    public Result<Void> markDefault(@PathVariable Long id) {
        providerService.markDefault(id);
        return Result.success();
    }

    @DeleteMapping("/{id:\\d+}")
    public Result<Void> delete(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return Result.success();
    }
}
