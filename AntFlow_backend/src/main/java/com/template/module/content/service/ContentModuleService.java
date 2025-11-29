package com.template.module.content.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.module.content.dto.ContentModuleCreateRequest;
import com.template.module.content.dto.ContentModuleQueryRequest;
import com.template.module.content.dto.ContentModuleUpdateRequest;
import com.template.module.content.dto.ContentModuleVO;
import com.template.module.content.entity.ContentModule;
import java.util.List;

public interface ContentModuleService extends IService<ContentModule> {

    List<ContentModuleVO> listModules(ContentModuleQueryRequest request);

    ContentModuleVO createModule(ContentModuleCreateRequest request);

    ContentModuleVO updateModule(Long id, ContentModuleUpdateRequest request);

    void deleteModule(Long id);

    ContentModuleVO generateContent(Long id);
}
