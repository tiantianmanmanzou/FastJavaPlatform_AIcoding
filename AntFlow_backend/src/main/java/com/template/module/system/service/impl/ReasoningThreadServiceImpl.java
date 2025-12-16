package com.template.module.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.response.PageResult;
import com.template.module.system.dto.ReasoningThreadCreateRequest;
import com.template.module.system.dto.ReasoningThreadMessageCreateRequest;
import com.template.module.system.dto.ReasoningThreadMessageVO;
import com.template.module.system.dto.ReasoningThreadQueryRequest;
import com.template.module.system.dto.ReasoningThreadUpdateRequest;
import com.template.module.system.dto.ReasoningThreadVO;
import com.template.module.system.entity.ReasoningThread;
import com.template.module.system.entity.ReasoningThreadMessage;
import com.template.module.system.mapper.ReasoningThreadMapper;
import com.template.module.system.mapper.ReasoningThreadMessageMapper;
import com.template.module.system.service.ReasoningThreadService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ReasoningThreadServiceImpl extends ServiceImpl<ReasoningThreadMapper, ReasoningThread>
    implements ReasoningThreadService {

    private final ReasoningThreadMessageMapper messageMapper;

    @Override
    public PageResult<ReasoningThreadVO> pageThreads(ReasoningThreadQueryRequest request) {
        Page<ReasoningThread> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<ReasoningThread> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(request.getKeyword())) {
            wrapper.and(qw -> qw.like(ReasoningThread::getThreadName, request.getKeyword())
                .or().like(ReasoningThread::getThreadIdentifier, request.getKeyword())
                .or().like(ReasoningThread::getModelName, request.getKeyword()));
        }
        if (StringUtils.hasText(request.getStatus())) {
            wrapper.eq(ReasoningThread::getStatus, request.getStatus());
        }
        if (StringUtils.hasText(request.getProviderCode())) {
            wrapper.eq(ReasoningThread::getProviderCode, request.getProviderCode());
        }
        wrapper.orderByDesc(ReasoningThread::getLastActivityTime)
            .orderByDesc(ReasoningThread::getUpdateTime);
        this.page(page, wrapper);
        List<ReasoningThreadVO> records = page.getRecords().stream()
            .map(this::toVO)
            .collect(Collectors.toList());
        return PageResult.of(records, page.getTotal(), page.getCurrent(), page.getSize());
    }

    @Override
    public ReasoningThreadVO getThread(Long id) {
        ReasoningThread thread = getById(id);
        if (thread == null) {
            throw new BusinessException(ErrorCode.REASONING_THREAD_NOT_FOUND);
        }
        return toVO(thread);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ReasoningThreadVO createThread(ReasoningThreadCreateRequest request) {
        ReasoningThread thread = new ReasoningThread();
        thread.setThreadName(request.getThreadName());
        thread.setProviderCode(request.getProviderCode());
        thread.setModelName(request.getModelName());
        thread.setMetadata(request.getMetadata());
        thread.setThreadIdentifier(UUID.randomUUID().toString());
        thread.setStatus("READY");
        thread.setMessageCount(0);
        thread.setInputTokens(0);
        thread.setOutputTokens(0);
        thread.setLatencyMillis(0);
        thread.setLastActivityTime(LocalDateTime.now());
        save(thread);
        return toVO(thread);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ReasoningThreadVO updateThread(Long id, ReasoningThreadUpdateRequest request) {
        ReasoningThread thread = getById(id);
        if (thread == null) {
            throw new BusinessException(ErrorCode.REASONING_THREAD_NOT_FOUND);
        }
        thread.setThreadName(request.getThreadName());
        if (StringUtils.hasText(request.getStatus())) {
            thread.setStatus(request.getStatus());
        }
        thread.setMetadata(request.getMetadata());
        updateById(thread);
        return toVO(thread);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteThread(Long id) {
        boolean removed = removeById(id);
        if (!removed) {
            throw new BusinessException(ErrorCode.REASONING_THREAD_NOT_FOUND);
        }
    }

    @Override
    public List<ReasoningThreadMessageVO> listMessages(Long threadId) {
        ensureThreadExists(threadId);
        return messageMapper.selectList(new LambdaQueryWrapper<ReasoningThreadMessage>()
                .eq(ReasoningThreadMessage::getThreadId, threadId)
                .orderByAsc(ReasoningThreadMessage::getCreatedAt))
            .stream()
            .map(this::toMessageVO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ReasoningThreadMessageVO appendMessage(Long threadId, ReasoningThreadMessageCreateRequest request) {
        ReasoningThread thread = ensureThreadExists(threadId);
        ReasoningThreadMessage message = new ReasoningThreadMessage();
        message.setThreadId(threadId);
        message.setRole(request.getRole());
        message.setContent(request.getContent());
        message.setTokenUsage(request.getTokenUsage());
        message.setLatencyMillis(request.getLatencyMillis());
        message.setCreatedAt(LocalDateTime.now());
        messageMapper.insert(message);
        recalculateThreadStats(threadId);
        return toMessageVO(message);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ReasoningThreadVO syncThreadStats(Long threadId) {
        ensureThreadExists(threadId);
        recalculateThreadStats(threadId);
        return getThread(threadId);
    }

    private ReasoningThread ensureThreadExists(Long id) {
        ReasoningThread thread = getById(id);
        if (thread == null) {
            throw new BusinessException(ErrorCode.REASONING_THREAD_NOT_FOUND);
        }
        return thread;
    }

    private void recalculateThreadStats(Long threadId) {
        List<ReasoningThreadMessage> messages = messageMapper.selectList(new LambdaQueryWrapper<ReasoningThreadMessage>()
            .eq(ReasoningThreadMessage::getThreadId, threadId)
            .orderByAsc(ReasoningThreadMessage::getCreatedAt));
        ReasoningThread thread = getById(threadId);
        if (thread == null) {
            return;
        }
        int messageCount = messages.size();
        int inputTokens = 0;
        int outputTokens = 0;
        int latency = 0;
        LocalDateTime lastActivity = thread.getLastActivityTime();
        for (ReasoningThreadMessage message : messages) {
            int usage = message.getTokenUsage() == null ? 0 : message.getTokenUsage();
            if ("user".equalsIgnoreCase(message.getRole()) || "system".equalsIgnoreCase(message.getRole())) {
                inputTokens += usage;
            } else {
                outputTokens += usage;
            }
            if (message.getLatencyMillis() != null) {
                latency = message.getLatencyMillis();
            }
            if (message.getCreatedAt() != null) {
                lastActivity = message.getCreatedAt();
            }
        }
        thread.setMessageCount(messageCount);
        thread.setInputTokens(inputTokens);
        thread.setOutputTokens(outputTokens);
        thread.setLatencyMillis(latency);
        thread.setLastActivityTime(lastActivity);
        updateById(thread);
    }

    private ReasoningThreadVO toVO(ReasoningThread entity) {
        ReasoningThreadVO vo = new ReasoningThreadVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private ReasoningThreadMessageVO toMessageVO(ReasoningThreadMessage entity) {
        ReasoningThreadMessageVO vo = new ReasoningThreadMessageVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
