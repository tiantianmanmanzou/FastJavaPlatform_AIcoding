package com.template.module.prompt.controller;

import com.template.common.response.Result;
import com.template.module.prompt.dto.PromptQueryRequest;
import com.template.module.prompt.dto.PromptRequest;
import com.template.module.prompt.dto.PromptVO;
import com.template.module.prompt.service.PromptService;
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
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
@Validated
public class PromptController {

    private final PromptService promptService;

    @GetMapping
    public Result<List<PromptVO>> list(PromptQueryRequest request) {
        return Result.success(promptService.listPrompts(request));
    }

    @PostMapping
    public Result<PromptVO> create(@Valid @RequestBody PromptRequest request) {
        return Result.success(promptService.createPrompt(request));
    }

    @PutMapping("/{id:\\d+}")
    public Result<PromptVO> update(@PathVariable Long id, @Valid @RequestBody PromptRequest request) {
        return Result.success(promptService.updatePrompt(id, request));
    }

    @DeleteMapping("/{id:\\d+}")
    public Result<Void> delete(@PathVariable Long id) {
        promptService.deletePrompt(id);
        return Result.success();
    }
}
