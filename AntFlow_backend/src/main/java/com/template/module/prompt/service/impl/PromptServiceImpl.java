package com.template.module.prompt.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.module.prompt.dto.PromptQueryRequest;
import com.template.module.prompt.dto.PromptRequest;
import com.template.module.prompt.dto.PromptVO;
import com.template.module.prompt.entity.Prompt;
import com.template.module.prompt.mapper.PromptMapper;
import com.template.module.prompt.service.PromptService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class PromptServiceImpl extends ServiceImpl<PromptMapper, Prompt> implements PromptService {

    @Override
    public List<PromptVO> listPrompts(PromptQueryRequest request) {
        LambdaQueryWrapper<Prompt> wrapper = new LambdaQueryWrapper<>();
        if (request != null) {
            if (StringUtils.hasText(request.getKeyword())) {
                wrapper.like(Prompt::getPromptName, request.getKeyword().trim());
            }
            if (StringUtils.hasText(request.getType())) {
                wrapper.eq(Prompt::getPromptType, normalizeType(request.getType()));
            }
        }
        wrapper.orderByDesc(Prompt::getUpdateTime);
        return this.list(wrapper).stream()
            .map(this::toVO)
            .collect(Collectors.toList());
    }

    @Override
    public PromptVO createPrompt(PromptRequest request) {
        Prompt prompt = new Prompt();
        prompt.setPromptName(request.getName().trim());
        prompt.setPromptContent(request.getContent().trim());
        prompt.setPromptType(normalizeType(request.getType()));
        this.save(prompt);
        return toVO(prompt);
    }

    @Override
    public PromptVO updatePrompt(Long id, PromptRequest request) {
        Prompt prompt = this.getById(id);
        if (prompt == null) {
            throw new BusinessException(ErrorCode.PROMPT_NOT_FOUND);
        }
        prompt.setPromptName(request.getName().trim());
        prompt.setPromptContent(request.getContent().trim());
        prompt.setPromptType(normalizeType(request.getType()));
        this.updateById(prompt);
        return toVO(prompt);
    }

    @Override
    public void deletePrompt(Long id) {
        boolean removed = this.removeById(id);
        if (!removed) {
            throw new BusinessException(ErrorCode.PROMPT_NOT_FOUND);
        }
    }

    private PromptVO toVO(Prompt prompt) {
        PromptVO vo = new PromptVO();
        vo.setId(prompt.getId());
        vo.setName(prompt.getPromptName());
        vo.setContent(prompt.getPromptContent());
        vo.setType(prompt.getPromptType());
        vo.setCreateTime(prompt.getCreateTime());
        vo.setUpdateTime(prompt.getUpdateTime());
        return vo;
    }

    private String normalizeType(String type) {
        return type == null ? null : type.trim().toUpperCase();
    }
}
