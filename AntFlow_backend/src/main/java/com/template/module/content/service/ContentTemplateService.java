package com.template.module.content.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.module.content.dto.ContentTemplateCreateRequest;
import com.template.module.content.dto.ContentTemplateQueryRequest;
import com.template.module.content.dto.ContentTemplateUpdateRequest;
import com.template.module.content.dto.ContentTemplateVO;
import com.template.module.content.entity.ContentTemplate;
import java.util.List;

public interface ContentTemplateService extends IService<ContentTemplate> {

    List<ContentTemplateVO> listTemplates(ContentTemplateQueryRequest request);

    ContentTemplateVO createTemplate(ContentTemplateCreateRequest request);

    ContentTemplateVO updateTemplate(Long id, ContentTemplateUpdateRequest request);

    void deleteTemplate(Long id);

    ContentTemplate findTemplate(Long id);
}
