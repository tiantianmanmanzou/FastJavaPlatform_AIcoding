package com.template.module.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.module.system.dto.LlmParamTemplateVO;
import com.template.module.system.entity.LlmModelParamTemplate;
import java.util.List;

public interface LlmParamTemplateService extends IService<LlmModelParamTemplate> {

    List<LlmModelParamTemplate> findTemplates(String vendor, String generationType);

    List<LlmParamTemplateVO> findTemplateVOs(String vendor, String generationType);
}
