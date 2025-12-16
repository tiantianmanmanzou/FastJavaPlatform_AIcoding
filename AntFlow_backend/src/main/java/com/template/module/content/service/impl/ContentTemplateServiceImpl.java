package com.template.module.content.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.module.content.dto.ContentTemplateCreateRequest;
import com.template.module.content.dto.ContentTemplateQueryRequest;
import com.template.module.content.dto.ContentTemplateUpdateRequest;
import com.template.module.content.dto.ContentTemplateVO;
import com.template.module.content.entity.ContentTemplate;
import com.template.module.content.mapper.ContentTemplateMapper;
import com.template.module.content.service.ContentTemplateService;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ContentTemplateServiceImpl extends ServiceImpl<ContentTemplateMapper, ContentTemplate>
    implements ContentTemplateService {

    @Override
    public List<ContentTemplateVO> listTemplates(ContentTemplateQueryRequest request) {
        var query = lambdaQuery();
        if (StringUtils.hasText(request.getPlatform())) {
            query.eq(ContentTemplate::getPlatform, request.getPlatform());
        }
        if (StringUtils.hasText(request.getModuleType())) {
            query.eq(ContentTemplate::getModuleType, request.getModuleType());
        }
        List<ContentTemplate> templates = query.orderByDesc(ContentTemplate::getUpdateTime).list();
        if (templates.isEmpty()) {
            return Collections.emptyList();
        }
        return templates.stream().map(this::toVO).collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ContentTemplateVO createTemplate(ContentTemplateCreateRequest request) {
        ContentTemplate template = new ContentTemplate();
        template.setTemplateName(request.getTemplateName());
        template.setPlatform(request.getPlatform());
        template.setModuleType(request.getModuleType());
        template.setDescription(request.getDescription());
        template.setPrompt(request.getPrompt());
        template.setTone(request.getTone());
        template.setStyle(request.getStyle());
        template.setContentLength(request.getContentLength());
        template.setImageStyle(request.getImageStyle());
        template.setImageRatio(request.getImageRatio());
        template.setImageQuantity(request.getImageQuantity());
        template.setVideoStyle(request.getVideoStyle());
        template.setVideoRatio(request.getVideoRatio());
        template.setVideoDuration(request.getVideoDuration());
        template.setApiVendor(request.getApiVendor());
        template.setApiName(request.getApiName());
        save(template);
        return toVO(template);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ContentTemplateVO updateTemplate(Long id, ContentTemplateUpdateRequest request) {
        ContentTemplate template = getById(id);
        if (template == null) {
            throw new BusinessException(ErrorCode.CONTENT_TEMPLATE_NOT_FOUND);
        }
        template.setTemplateName(request.getTemplateName());
        template.setPlatform(request.getPlatform());
        template.setModuleType(request.getModuleType());
        template.setDescription(request.getDescription());
        template.setPrompt(request.getPrompt());
        template.setTone(request.getTone());
        template.setStyle(request.getStyle());
        template.setContentLength(request.getContentLength());
        template.setImageStyle(request.getImageStyle());
        template.setImageRatio(request.getImageRatio());
        template.setImageQuantity(request.getImageQuantity());
        template.setVideoStyle(request.getVideoStyle());
        template.setVideoRatio(request.getVideoRatio());
        template.setVideoDuration(request.getVideoDuration());
        template.setApiVendor(request.getApiVendor());
        template.setApiName(request.getApiName());
        updateById(template);
        return toVO(template);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTemplate(Long id) {
        boolean removed = removeById(id);
        if (!removed) {
            throw new BusinessException(ErrorCode.CONTENT_TEMPLATE_NOT_FOUND);
        }
    }

    @Override
    public ContentTemplate findTemplate(Long id) {
        ContentTemplate template = getById(id);
        if (template == null) {
            throw new BusinessException(ErrorCode.CONTENT_TEMPLATE_NOT_FOUND);
        }
        return template;
    }

    private ContentTemplateVO toVO(ContentTemplate template) {
        return ContentTemplateVO.builder()
            .id(template.getId())
            .templateName(template.getTemplateName())
            .platform(template.getPlatform())
            .moduleType(template.getModuleType())
            .description(template.getDescription())
            .prompt(template.getPrompt())
            .tone(template.getTone())
            .style(template.getStyle())
            .contentLength(template.getContentLength())
            .imageStyle(template.getImageStyle())
            .imageRatio(template.getImageRatio())
            .imageQuantity(template.getImageQuantity())
            .videoStyle(template.getVideoStyle())
            .videoRatio(template.getVideoRatio())
            .videoDuration(template.getVideoDuration())
            .apiVendor(template.getApiVendor())
            .apiName(template.getApiName())
            .createTime(template.getCreateTime())
            .updateTime(template.getUpdateTime())
            .build();
    }
}
