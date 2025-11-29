package com.template.module.content.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.module.content.dto.ContentModuleCreateRequest;
import com.template.module.content.dto.ContentModuleQueryRequest;
import com.template.module.content.dto.ContentModuleResultVO;
import com.template.module.content.dto.ContentModuleUpdateRequest;
import com.template.module.content.dto.ContentModuleVO;
import com.template.module.content.entity.ContentModule;
import com.template.module.content.entity.ContentModuleResult;
import com.template.module.content.entity.ContentTemplate;
import com.template.module.content.enums.ContentApiVendor;
import com.template.module.content.enums.ContentModuleStatus;
import com.template.module.content.enums.ContentModuleType;
import com.template.module.content.enums.ContentPlatform;
import com.template.module.content.enums.ContentResultType;
import com.template.module.content.mapper.ContentModuleMapper;
import com.template.module.content.service.ContentModuleResultService;
import com.template.module.content.service.ContentModuleService;
import com.template.module.content.service.ContentTemplateService;
import com.template.module.product.entity.Product;
import com.template.module.product.service.ProductService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ContentModuleServiceImpl extends ServiceImpl<ContentModuleMapper, ContentModule>
    implements ContentModuleService {

    private final ContentModuleResultService contentModuleResultService;
    private final ContentTemplateService contentTemplateService;
    private final ProductService productService;

    @Override
    public List<ContentModuleVO> listModules(ContentModuleQueryRequest request) {
        if (request.getProductId() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "产品ID不能为空");
        }
        LambdaQueryWrapper<ContentModule> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ContentModule::getProductId, request.getProductId());
        if (StringUtils.hasText(request.getPlatform())) {
            wrapper.eq(ContentModule::getPlatform, normalizePlatform(request.getPlatform()));
        }
        wrapper.orderByAsc(ContentModule::getSortOrder).orderByDesc(ContentModule::getUpdateTime);
        List<ContentModule> modules = this.list(wrapper);
        if (modules.isEmpty()) {
            return Collections.emptyList();
        }
        List<Long> moduleIds = modules.stream().map(ContentModule::getId).toList();
        List<ContentModuleResult> results = contentModuleResultService.lambdaQuery()
            .in(ContentModuleResult::getModuleId, moduleIds)
            .orderByAsc(ContentModuleResult::getSortOrder)
            .list();
        Map<Long, List<ContentModuleResult>> groupedResults = results.stream()
            .collect(Collectors.groupingBy(ContentModuleResult::getModuleId));
        return modules.stream()
            .map(module -> toVO(module, groupedResults.getOrDefault(module.getId(), Collections.emptyList())))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ContentModuleVO createModule(ContentModuleCreateRequest request) {
        Product product = productService.getById(request.getProductId());
        if (product == null) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        String platform = normalizePlatform(request.getPlatform());
        String moduleType = normalizeModuleType(request.getModuleType());
        ContentTemplate template = null;
        if (request.getTemplateId() != null) {
            template = contentTemplateService.findTemplate(request.getTemplateId());
            if (!template.getPlatform().equals(platform) || !template.getModuleType().equals(moduleType)) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "模板类型与当前模块不匹配");
            }
        }
        ContentModule module = new ContentModule();
        module.setProductId(product.getId());
        module.setPlatform(platform);
        module.setModuleType(moduleType);
        module.setModuleTitle(request.getModuleTitle());
        module.setTemplateId(template == null ? null : template.getId());
        applyTemplateIfNecessary(module, template);
        overrideConfigWithRequest(module, request);
        applyVendorPreference(module, request.getApiVendor());
        module.setSortOrder(request.getSortOrder() == null ? resolveNextSort(product.getId(), platform) : request.getSortOrder());
        module.setStatus(ContentModuleStatus.DRAFT.name());
        save(module);
        return getModuleDetail(module.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ContentModuleVO updateModule(Long id, ContentModuleUpdateRequest request) {
        ContentModule module = getById(id);
        if (module == null) {
            throw new BusinessException(ErrorCode.CONTENT_MODULE_NOT_FOUND);
        }
        module.setModuleTitle(request.getModuleTitle());
        if (request.getTemplateId() != null) {
            ContentTemplate template = contentTemplateService.findTemplate(request.getTemplateId());
            if (!template.getPlatform().equals(module.getPlatform()) || !template.getModuleType().equals(module.getModuleType())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "模板类型与当前模块不匹配");
            }
            module.setTemplateId(template.getId());
            applyTemplateIfNecessary(module, template);
        } else if (request.getTemplateId() == null) {
            module.setTemplateId(null);
        }
        overrideConfigWithUpdate(module, request);
        if (request.getApiVendor() != null) {
            applyVendorPreference(module, request.getApiVendor());
        }
        if (request.getSortOrder() != null) {
            module.setSortOrder(request.getSortOrder());
        }
        if (StringUtils.hasText(request.getStatus())) {
            module.setStatus(resolveStatus(request.getStatus()));
        }
        updateById(module);
        return getModuleDetail(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteModule(Long id) {
        contentModuleResultService.lambdaUpdate().eq(ContentModuleResult::getModuleId, id).remove();
        boolean removed = removeById(id);
        if (!removed) {
            throw new BusinessException(ErrorCode.CONTENT_MODULE_NOT_FOUND);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ContentModuleVO generateContent(Long id) {
        ContentModule module = getById(id);
        if (module == null) {
            throw new BusinessException(ErrorCode.CONTENT_MODULE_NOT_FOUND);
        }
        module.setStatus(ContentModuleStatus.GENERATING.name());
        updateById(module);
        contentModuleResultService.lambdaUpdate().eq(ContentModuleResult::getModuleId, id).remove();
        List<ContentModuleResult> newResults = simulateResults(module);
        if (!newResults.isEmpty()) {
            contentModuleResultService.saveBatch(newResults);
        }
        module.setStatus(ContentModuleStatus.GENERATED.name());
        module.setLastGeneratedAt(LocalDateTime.now());
        updateById(module);
        return getModuleDetail(id);
    }

    private ContentModuleVO getModuleDetail(Long id) {
        ContentModule module = getById(id);
        if (module == null) {
            throw new BusinessException(ErrorCode.CONTENT_MODULE_NOT_FOUND);
        }
        List<ContentModuleResult> results = contentModuleResultService.lambdaQuery()
            .eq(ContentModuleResult::getModuleId, id)
            .orderByAsc(ContentModuleResult::getSortOrder)
            .list();
        return toVO(module, results);
    }

    private String normalizePlatform(String platformCode) {
        ContentPlatform platform = ContentPlatform.fromCode(platformCode);
        if (platform == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "不支持的平台类型");
        }
        return platform.getCode();
    }

    private String normalizeModuleType(String moduleTypeCode) {
        ContentModuleType moduleType = ContentModuleType.fromCode(moduleTypeCode);
        if (moduleType == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "不支持的模块类型");
        }
        return moduleType.getCode();
    }

    private String resolveVendor(String vendorCode) {
        if (!StringUtils.hasText(vendorCode)) {
            return ContentApiVendor.GOOGLE.getCode();
        }
        ContentApiVendor vendor = ContentApiVendor.fromCode(vendorCode);
        if (vendor == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "不支持的API厂商");
        }
        return vendor.getCode();
    }

    private void applyVendorPreference(ContentModule module, String vendorCode) {
        if (StringUtils.hasText(vendorCode)) {
            module.setApiVendor(resolveVendor(vendorCode));
        } else if (!StringUtils.hasText(module.getApiVendor())) {
            module.setApiVendor(ContentApiVendor.GOOGLE.getCode());
        }
    }

    private String resolveStatus(String status) {
        try {
            return ContentModuleStatus.valueOf(status.toUpperCase(Locale.ROOT)).name();
        } catch (IllegalArgumentException ex) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "无效的模块状态");
        }
    }

    private void applyTemplateIfNecessary(ContentModule module, ContentTemplate template) {
        if (template == null) {
            return;
        }
        module.setPrompt(template.getPrompt());
        module.setTone(template.getTone());
        module.setStyle(template.getStyle());
        module.setContentLength(template.getContentLength());
        module.setImageStyle(template.getImageStyle());
        module.setImageRatio(template.getImageRatio());
        module.setImageQuantity(template.getImageQuantity());
        module.setVideoStyle(template.getVideoStyle());
        module.setVideoRatio(template.getVideoRatio());
        module.setVideoDuration(template.getVideoDuration());
        module.setApiVendor(template.getApiVendor());
    }

    private void overrideConfigWithRequest(ContentModule module, ContentModuleCreateRequest request) {
        if (StringUtils.hasText(request.getPrompt())) {
            module.setPrompt(request.getPrompt());
        }
        if (StringUtils.hasText(request.getTone())) {
            module.setTone(request.getTone());
        }
        if (StringUtils.hasText(request.getStyle())) {
            module.setStyle(request.getStyle());
        }
        if (StringUtils.hasText(request.getContentLength())) {
            module.setContentLength(request.getContentLength());
        }
        if (StringUtils.hasText(request.getImageStyle())) {
            module.setImageStyle(request.getImageStyle());
        }
        if (StringUtils.hasText(request.getImageRatio())) {
            module.setImageRatio(request.getImageRatio());
        }
        if (request.getImageQuantity() != null) {
            module.setImageQuantity(request.getImageQuantity());
        }
        if (StringUtils.hasText(request.getVideoStyle())) {
            module.setVideoStyle(request.getVideoStyle());
        }
        if (StringUtils.hasText(request.getVideoRatio())) {
            module.setVideoRatio(request.getVideoRatio());
        }
        if (request.getVideoDuration() != null) {
            module.setVideoDuration(request.getVideoDuration());
        }
    }

    private void overrideConfigWithUpdate(ContentModule module, ContentModuleUpdateRequest request) {
        if (StringUtils.hasText(request.getPrompt())) {
            module.setPrompt(request.getPrompt());
        }
        if (request.getPrompt() != null && !StringUtils.hasText(request.getPrompt())) {
            module.setPrompt(null);
        }
        if (request.getTone() != null) {
            module.setTone(request.getTone());
        }
        if (request.getStyle() != null) {
            module.setStyle(request.getStyle());
        }
        if (request.getContentLength() != null) {
            module.setContentLength(request.getContentLength());
        }
        if (request.getImageStyle() != null) {
            module.setImageStyle(request.getImageStyle());
        }
        if (request.getImageRatio() != null) {
            module.setImageRatio(request.getImageRatio());
        }
        if (request.getImageQuantity() != null) {
            module.setImageQuantity(request.getImageQuantity());
        }
        if (request.getVideoStyle() != null) {
            module.setVideoStyle(request.getVideoStyle());
        }
        if (request.getVideoRatio() != null) {
            module.setVideoRatio(request.getVideoRatio());
        }
        if (request.getVideoDuration() != null) {
            module.setVideoDuration(request.getVideoDuration());
        }
    }

    private List<ContentModuleResult> simulateResults(ContentModule module) {
        List<ContentModuleResult> results = new ArrayList<>();
        ContentModuleType moduleType = ContentModuleType.fromCode(module.getModuleType());
        if (moduleType == null) {
            return results;
        }
        switch (moduleType) {
            case IMAGE -> {
                int count = module.getImageQuantity() == null || module.getImageQuantity() <= 0 ? 3 : module.getImageQuantity();
                for (int i = 0; i < count; i++) {
                    ContentModuleResult result = new ContentModuleResult();
                    result.setModuleId(module.getId());
                    result.setResultType(ContentResultType.IMAGE.name());
                    result.setAssetUrl(String.format("https://placehold.co/320x180?text=%s-%d", sanitizeForUrl(module.getModuleTitle()), i + 1));
                    result.setContent("AI生成的图片预览 " + (i + 1));
                    result.setSortOrder(i);
                    results.add(result);
                }
            }
            case ARTICLE -> {
                ContentModuleResult result = new ContentModuleResult();
                result.setModuleId(module.getId());
                result.setResultType(ContentResultType.TEXT.name());
                StringBuilder builder = new StringBuilder();
                builder.append("《").append(module.getModuleTitle()).append("》\n");
                builder.append("根据产品亮点生成的正文示例，包含风格：")
                    .append(StringUtils.hasText(module.getTone()) ? module.getTone() : "商业");
                builder.append("，长度偏向：")
                    .append(StringUtils.hasText(module.getContentLength()) ? module.getContentLength() : "中等");
                builder.append("。\n");
                builder.append("1. 引子与场景铺垫\n2. 产品核心卖点\n3. 使用体验与人群\n4. 行动号召");
                result.setContent(builder.toString());
                result.setSortOrder(0);
                results.add(result);
            }
            case VIDEO -> {
                ContentModuleResult result = new ContentModuleResult();
                result.setModuleId(module.getId());
                result.setResultType(ContentResultType.VIDEO.name());
                result.setAssetUrl(String.format("https://placehold.co/480x270?text=%s", sanitizeForUrl(module.getModuleTitle())));
                result.setContent("视频脚本概览：强调产品场景、节奏和镜头建议。");
                result.setSortOrder(0);
                results.add(result);
            }
            default -> {
            }
        }
        return results;
    }

    private int resolveNextSort(Long productId, String platform) {
        Integer maxSort = lambdaQuery()
            .eq(ContentModule::getProductId, productId)
            .eq(ContentModule::getPlatform, platform)
            .select(ContentModule::getSortOrder)
            .list().stream()
            .map(ContentModule::getSortOrder)
            .filter(Objects::nonNull)
            .max(Comparator.naturalOrder())
            .orElse(-1);
        return maxSort + 1;
    }

    private ContentModuleVO toVO(ContentModule module, List<ContentModuleResult> results) {
        List<ContentModuleResultVO> resultVOS = CollectionUtils.isEmpty(results)
            ? Collections.emptyList()
            : results.stream()
                .map(result -> ContentModuleResultVO.builder()
                    .id(result.getId())
                    .moduleId(result.getModuleId())
                    .resultType(result.getResultType())
                    .content(result.getContent())
                    .assetUrl(result.getAssetUrl())
                    .sortOrder(result.getSortOrder())
                    .build())
                .collect(Collectors.toList());
        return ContentModuleVO.builder()
            .id(module.getId())
            .productId(module.getProductId())
            .platform(module.getPlatform())
            .moduleType(module.getModuleType())
            .moduleTitle(module.getModuleTitle())
            .templateId(module.getTemplateId())
            .prompt(module.getPrompt())
            .tone(module.getTone())
            .style(module.getStyle())
            .contentLength(module.getContentLength())
            .imageStyle(module.getImageStyle())
            .imageRatio(module.getImageRatio())
            .imageQuantity(module.getImageQuantity())
            .videoStyle(module.getVideoStyle())
            .videoRatio(module.getVideoRatio())
            .videoDuration(module.getVideoDuration())
            .apiVendor(module.getApiVendor())
            .sortOrder(module.getSortOrder())
            .status(module.getStatus())
            .lastGeneratedAt(module.getLastGeneratedAt())
            .createTime(module.getCreateTime())
            .updateTime(module.getUpdateTime())
            .results(resultVOS)
            .build();
    }

    private String sanitizeForUrl(String text) {
        if (!StringUtils.hasText(text)) {
            return "Module";
        }
        return text.trim().replaceAll("\\s+", "+");
    }
}
