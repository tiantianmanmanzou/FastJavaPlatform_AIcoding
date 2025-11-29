package com.template.module.content.controller;

import com.template.common.response.Result;
import com.template.module.content.dto.ContentTemplateCreateRequest;
import com.template.module.content.dto.ContentTemplateQueryRequest;
import com.template.module.content.dto.ContentTemplateUpdateRequest;
import com.template.module.content.dto.ContentTemplateVO;
import com.template.module.content.service.ContentTemplateService;
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
@RequestMapping("/api/content/templates")
@RequiredArgsConstructor
@Validated
public class ContentTemplateController {

    private final ContentTemplateService contentTemplateService;

    @GetMapping
    public Result<List<ContentTemplateVO>> list(ContentTemplateQueryRequest request) {
        return Result.success(contentTemplateService.listTemplates(request));
    }

    @PostMapping
    public Result<ContentTemplateVO> create(@Valid @RequestBody ContentTemplateCreateRequest request) {
        return Result.success(contentTemplateService.createTemplate(request));
    }

    @PutMapping("/{id}")
    public Result<ContentTemplateVO> update(@PathVariable Long id, @Valid @RequestBody ContentTemplateUpdateRequest request) {
        return Result.success(contentTemplateService.updateTemplate(id, request));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        contentTemplateService.deleteTemplate(id);
        return Result.success();
    }
}
