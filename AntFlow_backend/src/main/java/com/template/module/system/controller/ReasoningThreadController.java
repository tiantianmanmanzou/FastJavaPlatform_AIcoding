package com.template.module.system.controller;

import com.template.common.response.PageResult;
import com.template.common.response.Result;
import com.template.module.system.dto.ReasoningThreadCreateRequest;
import com.template.module.system.dto.ReasoningThreadMessageCreateRequest;
import com.template.module.system.dto.ReasoningThreadMessageVO;
import com.template.module.system.dto.ReasoningThreadQueryRequest;
import com.template.module.system.dto.ReasoningThreadUpdateRequest;
import com.template.module.system.dto.ReasoningThreadVO;
import com.template.module.system.service.ReasoningThreadService;
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
@RequestMapping("/api/system/reasoning-threads")
@RequiredArgsConstructor
@Validated
public class ReasoningThreadController {

    private final ReasoningThreadService threadService;

    @GetMapping
    public PageResult<ReasoningThreadVO> page(ReasoningThreadQueryRequest request) {
        return threadService.pageThreads(request);
    }

    @GetMapping("/{id}")
    public Result<ReasoningThreadVO> detail(@PathVariable Long id) {
        return Result.success(threadService.getThread(id));
    }

    @PostMapping
    public Result<ReasoningThreadVO> create(@Valid @RequestBody ReasoningThreadCreateRequest request) {
        return Result.success(threadService.createThread(request));
    }

    @PutMapping("/{id}")
    public Result<ReasoningThreadVO> update(@PathVariable Long id, @Valid @RequestBody ReasoningThreadUpdateRequest request) {
        return Result.success(threadService.updateThread(id, request));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        threadService.deleteThread(id);
        return Result.success();
    }

    @GetMapping("/{id}/messages")
    public Result<List<ReasoningThreadMessageVO>> listMessages(@PathVariable Long id) {
        return Result.success(threadService.listMessages(id));
    }

    @PostMapping("/{id}/messages")
    public Result<ReasoningThreadMessageVO> appendMessage(@PathVariable Long id,
                                                          @Valid @RequestBody ReasoningThreadMessageCreateRequest request) {
        return Result.success(threadService.appendMessage(id, request));
    }

    @PostMapping("/{id}/sync")
    public Result<ReasoningThreadVO> sync(@PathVariable Long id) {
        return Result.success(threadService.syncThreadStats(id));
    }
}
