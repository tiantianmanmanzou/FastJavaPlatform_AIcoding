package com.template.module.content.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.module.content.entity.ContentModuleResult;
import com.template.module.content.mapper.ContentModuleResultMapper;
import com.template.module.content.service.ContentModuleResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContentModuleResultServiceImpl extends ServiceImpl<ContentModuleResultMapper, ContentModuleResult>
    implements ContentModuleResultService {
}
