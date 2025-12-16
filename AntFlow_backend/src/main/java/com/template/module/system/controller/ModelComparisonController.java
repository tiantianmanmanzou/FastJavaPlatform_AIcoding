package com.template.module.system.controller;

import com.template.common.response.PageResult;
import com.template.common.response.Result;
import com.template.module.system.dto.ModelComparisonQueryRequest;
import com.template.module.system.dto.ModelComparisonRequest;
import com.template.module.system.dto.ModelComparisonVO;
import com.template.module.system.service.ModelComparisonService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/system/model-comparisons")
@RequiredArgsConstructor
@Validated
public class ModelComparisonController {

    private final ModelComparisonService comparisonService;

    @GetMapping
    public PageResult<ModelComparisonVO> page(ModelComparisonQueryRequest request) {
        return comparisonService.pageComparisons(request);
    }

    @GetMapping("/{id}")
    public Result<ModelComparisonVO> detail(@PathVariable Long id) {
        return Result.success(comparisonService.getComparison(id));
    }

    @PostMapping
    public Result<ModelComparisonVO> create(@Valid @RequestBody ModelComparisonRequest request) {
        return Result.success(comparisonService.createComparison(request));
    }

    @PutMapping("/{id}")
    public Result<ModelComparisonVO> update(@PathVariable Long id, @Valid @RequestBody ModelComparisonRequest request) {
        return Result.success(comparisonService.updateComparison(id, request));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        comparisonService.deleteComparison(id);
        return Result.success();
    }

    @PostMapping("/{id}/run")
    public Result<ModelComparisonVO> run(@PathVariable Long id) {
        return Result.success(comparisonService.runComparison(id));
    }
}
