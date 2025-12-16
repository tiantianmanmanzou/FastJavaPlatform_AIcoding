package com.template.module.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.common.response.PageResult;
import com.template.module.system.dto.ReasoningThreadCreateRequest;
import com.template.module.system.dto.ReasoningThreadMessageCreateRequest;
import com.template.module.system.dto.ReasoningThreadMessageVO;
import com.template.module.system.dto.ReasoningThreadQueryRequest;
import com.template.module.system.dto.ReasoningThreadUpdateRequest;
import com.template.module.system.dto.ReasoningThreadVO;
import com.template.module.system.entity.ReasoningThread;
import java.util.List;

public interface ReasoningThreadService extends IService<ReasoningThread> {

    PageResult<ReasoningThreadVO> pageThreads(ReasoningThreadQueryRequest request);

    ReasoningThreadVO getThread(Long id);

    ReasoningThreadVO createThread(ReasoningThreadCreateRequest request);

    ReasoningThreadVO updateThread(Long id, ReasoningThreadUpdateRequest request);

    void deleteThread(Long id);

    List<ReasoningThreadMessageVO> listMessages(Long threadId);

    ReasoningThreadMessageVO appendMessage(Long threadId, ReasoningThreadMessageCreateRequest request);

    ReasoningThreadVO syncThreadStats(Long threadId);
}
