package com.template.module.prompt.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.module.prompt.dto.PromptQueryRequest;
import com.template.module.prompt.dto.PromptRequest;
import com.template.module.prompt.dto.PromptVO;
import com.template.module.prompt.entity.Prompt;
import java.util.List;

public interface PromptService extends IService<Prompt> {

    List<PromptVO> listPrompts(PromptQueryRequest request);

    PromptVO createPrompt(PromptRequest request);

    PromptVO updatePrompt(Long id, PromptRequest request);

    void deletePrompt(Long id);
}
