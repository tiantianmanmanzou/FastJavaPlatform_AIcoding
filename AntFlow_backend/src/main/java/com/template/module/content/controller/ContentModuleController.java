package com.template.module.content.controller;

import com.template.common.response.Result;
import com.template.module.content.dto.ContentModuleCreateRequest;
import com.template.module.content.dto.ContentModuleQueryRequest;
import com.template.module.content.dto.ContentModuleUpdateRequest;
import com.template.module.content.dto.ContentModuleVO;
import com.template.module.content.service.ContentModuleService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/content/modules")
@RequiredArgsConstructor
@Validated
public class ContentModuleController {

    private final ContentModuleService contentModuleService;

    @GetMapping
    public Result<List<ContentModuleVO>> list(ContentModuleQueryRequest request) {
        return Result.success(contentModuleService.listModules(request));
    }

    @PostMapping
    public Result<ContentModuleVO> create(@Valid @RequestBody ContentModuleCreateRequest request) {
        return Result.success(contentModuleService.createModule(request));
    }

    @PutMapping("/{id}")
    public Result<ContentModuleVO> update(@PathVariable Long id, @Valid @RequestBody ContentModuleUpdateRequest request) {
        return Result.success(contentModuleService.updateModule(id, request));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        contentModuleService.deleteModule(id);
        return Result.success();
    }

    @PostMapping("/{id}/generate")
    public Result<ContentModuleVO> generate(@PathVariable Long id) {
        return Result.success(contentModuleService.generateContent(id));
    }
}
