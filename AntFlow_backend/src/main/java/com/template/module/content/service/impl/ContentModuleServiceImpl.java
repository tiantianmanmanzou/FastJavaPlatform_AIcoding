package com.template.module.content.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.storage.FileStorageService;
import com.template.module.content.dto.ContentModuleCreateRequest;
import com.template.module.content.client.GoogleImagenClient;
import com.template.module.content.client.MinimaxImageClient;
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
import com.template.module.content.service.TextGenerationService;
import com.template.module.product.dto.ProductImageVO;
import com.template.module.product.dto.ProductVO;
import com.template.module.product.entity.Product;
import com.template.module.product.service.ProductService;
import com.template.module.system.entity.LlmProvider;
import com.template.module.system.service.LlmProviderService;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentModuleServiceImpl extends ServiceImpl<ContentModuleMapper, ContentModule>
    implements ContentModuleService {

    private final ContentModuleResultService contentModuleResultService;
    private final ContentTemplateService contentTemplateService;
    private final ProductService productService;
    private final GoogleImagenClient googleImagenClient;
    private final MinimaxImageClient minimaxImageClient;
    private final LlmProviderService llmProviderService;
    private final FileStorageService fileStorageService;
    private final TextGenerationService textGenerationService;

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
        ensureSubjectImageAccessible(module);
        applyDefaultSubjectImage(module, product.getId());
        ensureSubjectImageAccessible(module);
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
        ensureSubjectImageAccessible(module);
        applyDefaultSubjectImage(module, module.getProductId());
        ensureSubjectImageAccessible(module);
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
        applyDefaultSubjectImage(module, module.getProductId());
        ensureSubjectImageAccessible(module);
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
            String normalized = vendorCode.trim().toUpperCase(Locale.ROOT);
            log.warn("Unknown API vendor {}, fallback to normalized value {}", vendorCode, normalized);
            return normalized;
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

    private void applyDefaultSubjectImage(ContentModule module, Long productId) {
        if (module == null || module.getModuleType() == null) {
            return;
        }
        if (!ContentModuleType.IMAGE.getCode().equalsIgnoreCase(module.getModuleType())) {
            return;
        }
        if (StringUtils.hasText(module.getSubjectImageUrl())) {
            return;
        }
        ProductVO product = productService.getProduct(productId);
        if (product == null || CollectionUtils.isEmpty(product.getImages())) {
            return;
        }
        String primaryImage = product.getImages().stream()
            .filter(img -> Boolean.TRUE.equals(img.getPrimary()))
            .map(ProductImageVO::getImageUrl)
            .filter(StringUtils::hasText)
            .findFirst()
            .orElse(null);
        if (!StringUtils.hasText(primaryImage)) {
            primaryImage = product.getImages().stream()
                .map(ProductImageVO::getImageUrl)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(null);
        }
        if (StringUtils.hasText(primaryImage)) {
            module.setSubjectImageUrl(primaryImage);
        }
    }

    private void ensureSubjectImageAccessible(ContentModule module) {
        if (module == null) {
            return;
        }
        if (StringUtils.hasText(module.getSubjectImageUrl())) {
            module.setSubjectImageUrl(fileStorageService.ensureAccessibleUrl(module.getSubjectImageUrl()));
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
        module.setApiName(template.getApiName());
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
        if (StringUtils.hasText(request.getSubjectImageUrl())) {
            module.setSubjectImageUrl(fileStorageService.ensureAccessibleUrl(request.getSubjectImageUrl()));
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
        if (StringUtils.hasText(request.getApiName())) {
            module.setApiName(request.getApiName());
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
        if (request.getSubjectImageUrl() != null) {
            module.setSubjectImageUrl(StringUtils.hasText(request.getSubjectImageUrl())
                ? fileStorageService.ensureAccessibleUrl(request.getSubjectImageUrl())
                : null);
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
        if (request.getApiName() != null) {
            module.setApiName(StringUtils.hasText(request.getApiName()) ? request.getApiName() : null);
        }
    }

    private String resolvePromptWithSubjectImage(ContentModule module) {
        if (!StringUtils.hasText(module.getPrompt())) {
            return module.getPrompt();
        }
        String subjectImage = StringUtils.hasText(module.getSubjectImageUrl()) ? module.getSubjectImageUrl() : "";
        return module.getPrompt().replace("{主体图}", subjectImage);
    }

    private String resolveArticlePrompt(ContentModule module) {
        if (StringUtils.hasText(module.getPrompt())) {
            return module.getPrompt();
        }
        StringBuilder builder = new StringBuilder();
        builder.append("请围绕产品「").append(module.getModuleTitle()).append("」撰写推广文案，");
        builder.append("风格偏向：").append(StringUtils.hasText(module.getTone()) ? module.getTone() : "商务");
        builder.append("，整体长度：").append(StringUtils.hasText(module.getContentLength()) ? module.getContentLength() : "中等");
        if (StringUtils.hasText(module.getStyle())) {
            builder.append("，整体调性：").append(module.getStyle());
        }
        builder.append("。文案需要包含引导语、产品亮点、使用场景以及行动号召。");
        return builder.toString();
    }

    private String buildArticleFallback(ContentModule module) {
        StringBuilder builder = new StringBuilder();
        builder.append("《").append(module.getModuleTitle()).append("》\n");
        builder.append("根据产品亮点生成的正文示例，包含风格：")
            .append(StringUtils.hasText(module.getTone()) ? module.getTone() : "商业");
        builder.append("，长度偏向：")
            .append(StringUtils.hasText(module.getContentLength()) ? module.getContentLength() : "中等");
        builder.append("。\n");
        builder.append("1. 引子与场景铺垫\n2. 产品核心卖点\n3. 使用体验与人群\n4. 行动号召");
        return builder.toString();
    }

    private List<ContentModuleResult> simulateResults(ContentModule module) {
        List<ContentModuleResult> results = new ArrayList<>();
        ContentModuleType moduleType = ContentModuleType.fromCode(module.getModuleType());
        if (moduleType == null) {
            return results;
        }
        switch (moduleType) {
            case IMAGE -> {
                int count = resolveImageQuantity(module);
                String resolvedPrompt = resolvePromptWithSubjectImage(module);
                List<String> remoteAssets = generateImagesByVendor(module, resolvedPrompt, count);
                if (!CollectionUtils.isEmpty(remoteAssets)) {
                    for (int i = 0; i < remoteAssets.size(); i++) {
                        ContentModuleResult result = new ContentModuleResult();
                        result.setModuleId(module.getId());
                        result.setResultType(ContentResultType.IMAGE.name());
                        result.setAssetUrl(remoteAssets.get(i));
                        result.setContent(buildImageResultContent(module, resolvedPrompt));
                        result.setSortOrder(i);
                        results.add(result);
                    }
                } else {
                    for (int i = 0; i < count; i++) {
                        ContentModuleResult result = new ContentModuleResult();
                        result.setModuleId(module.getId());
                        result.setResultType(ContentResultType.IMAGE.name());
                        result.setAssetUrl(resolveImageAssetUrl(module, i));
                        result.setContent(buildImageResultContent(module, resolvedPrompt));
                        result.setSortOrder(i);
                        results.add(result);
                    }
                }
            }
            case ARTICLE -> {
                ContentModuleResult result = new ContentModuleResult();
                result.setModuleId(module.getId());
                result.setResultType(ContentResultType.TEXT.name());
                String prompt = resolveArticlePrompt(module);
                String generated = textGenerationService.generateArticle(module, prompt)
                    .orElseGet(() -> buildArticleFallback(module));
                result.setContent(generated);
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
            .subjectImageUrl(module.getSubjectImageUrl())
            .imageStyle(module.getImageStyle())
            .imageRatio(module.getImageRatio())
            .imageQuantity(module.getImageQuantity())
            .videoStyle(module.getVideoStyle())
            .videoRatio(module.getVideoRatio())
            .videoDuration(module.getVideoDuration())
            .apiVendor(module.getApiVendor())
            .apiName(module.getApiName())
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

    private int resolveImageQuantity(ContentModule module) {
        if (module.getImageQuantity() == null || module.getImageQuantity() <= 0) {
            return 3;
        }
        return module.getImageQuantity();
    }

    private String resolveImageAssetUrl(ContentModule module, int index) {
        int[] dimensions = resolveImageDimensions(module.getImageRatio());
        String colorSeed = (module.getModuleTitle() == null ? "" : module.getModuleTitle())
            + "|" + (module.getImageStyle() == null ? "" : module.getImageStyle())
            + "|" + (module.getPrompt() == null ? "" : module.getPrompt()) + "|" + index;
        String[] gradient = resolveGradientColors(colorSeed);
        String title = sanitizeForSvgText(module.getModuleTitle());
        String style = sanitizeForSvgText(StringUtils.hasText(module.getImageStyle()) ? module.getImageStyle() : "AI风格");
        String ratio = sanitizeForSvgText(StringUtils.hasText(module.getImageRatio()) ? module.getImageRatio() : "1:1");
        String svg = String.format(Locale.ROOT,
            "<svg xmlns='http://www.w3.org/2000/svg' width='%d' height='%d' viewBox='0 0 %d %d'>"
                + "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>"
                + "<stop offset='0%%' stop-color='%s'/>"
                + "<stop offset='100%%' stop-color='%s'/>"
                + "</linearGradient></defs>"
                + "<rect width='100%%' height='100%%' rx='32' fill='url(#g)'/>"
                + "<text x='50%%' y='45%%' font-size='28' text-anchor='middle' fill='#ffffff' font-family='PingFang SC,Source Han Sans,sans-serif'>%s</text>"
                + "<text x='50%%' y='63%%' font-size='16' text-anchor='middle' fill='#ffffff' opacity='0.9'>%s · #%d</text>"
                + "<text x='50%%' y='80%%' font-size='14' text-anchor='middle' fill='#ffffff' opacity='0.75'>%s</text>"
                + "</svg>",
            dimensions[0], dimensions[1], dimensions[0], dimensions[1], gradient[0], gradient[1], title, style, index + 1, ratio);
        String encoded = URLEncoder.encode(svg, StandardCharsets.UTF_8);
        return "data:image/svg+xml;utf8," + encoded;
    }

    private String buildImageResultContent(ContentModule module, String prompt) {
        String promptHint = StringUtils.hasText(prompt) ? prompt : "未填写提示词";
        String subjectSummary = describeSubjectImage(module.getSubjectImageUrl());
        String vendor = StringUtils.hasText(module.getApiVendor()) ? module.getApiVendor() : ContentApiVendor.GOOGLE.getCode();
        String style = StringUtils.hasText(module.getImageStyle()) ? module.getImageStyle() : "默认";
        String ratio = StringUtils.hasText(module.getImageRatio()) ? module.getImageRatio() : "1:1";
        int quantity = resolveImageQuantity(module);
        return String.format("提示词：%s%n主体图：%s%n厂商：%s | 风格：%s | 比例：%s | 数量：%d",
            promptHint, subjectSummary, vendor, style, ratio, quantity);
    }

    private String describeSubjectImage(String subjectImageUrl) {
        if (!StringUtils.hasText(subjectImageUrl)) {
            return "未选择主体图";
        }
        String trimmed = subjectImageUrl.trim();
        if (trimmed.startsWith("http")) {
            return trimmed;
        }
        int length = trimmed.length();
        int approxBytes = (int) Math.round((length / 4.0) * 3);
        int approxKb = Math.max(1, approxBytes / 1024);
        return String.format("已上传图片（约%dKB，Base64长度%d）", approxKb, length);
    }

    private int[] resolveImageDimensions(String ratio) {
        if (!StringUtils.hasText(ratio)) {
            return new int[] { 640, 640 };
        }
        String normalized = ratio.trim();
        return switch (normalized) {
            case "16:9" -> new int[] { 768, 432 };
            case "9:16" -> new int[] { 432, 768 };
            case "4:3" -> new int[] { 640, 480 };
            default -> new int[] { 640, 640 };
        };
    }

    private String[] resolveGradientColors(String seed) {
        int hash = seed == null ? 0 : seed.hashCode();
        String first = toHexColor(hash);
        String second = toHexColor(Integer.rotateLeft(hash, 11));
        return new String[] { first, second };
    }

    private String toHexColor(int value) {
        int color = Math.abs(value) % 0xFFFFFF;
        color = color < 0x111111 ? color + 0x222222 : color;
        return String.format("#%06X", color);
    }

    private String sanitizeForSvgText(String text) {
        if (!StringUtils.hasText(text)) {
            return "AI 生成图";
        }
        String sanitized = text.replaceAll("[<>\"']", "").trim();
        if (sanitized.length() > 24) {
            sanitized = sanitized.substring(0, 24) + "...";
        }
        return sanitized;
    }

    /**
     * 根据API厂商调用对应的图片生成服务
     */
    private List<String> generateImagesByVendor(ContentModule module, String resolvedPrompt, int count) {
        ensureSubjectImageAccessible(module);
        String vendorCode = StringUtils.hasText(module.getApiVendor()) ? module.getApiVendor() : ContentApiVendor.GOOGLE.getCode();
        ContentApiVendor vendor = ContentApiVendor.fromCode(vendorCode);
        if (vendor == null) {
            log.warn("Vendor {} is not supported, skip image generation", vendorCode);
            return Collections.emptyList();
        }

        LlmProvider provider = llmProviderService.findActiveProvider(vendor.getCode(), module.getApiName()).orElse(null);

        return switch (vendor) {
            case MINIMAX -> {
                if (provider == null || !StringUtils.hasText(provider.getApiKey())) {
                    log.warn("MiniMax provider not configured or API key missing, fallback to placeholder");
                    yield Collections.emptyList();
                }
                String endpoint = provider.getBaseUrl();
                String modelName = StringUtils.hasText(provider.getModelName())
                    ? provider.getModelName()
                    : module.getApiName();
                yield minimaxImageClient.generateImages(
                    resolvedPrompt,
                    module.getImageRatio(),
                    module.getSubjectImageUrl(),
                    provider.getApiKey(),
                    endpoint,
                    modelName
                );
            }
            case GOOGLE -> {
                String modelOverride = provider != null && StringUtils.hasText(provider.getModelName())
                    ? provider.getModelName()
                    : module.getApiName();
                yield googleImagenClient.generateImages(resolvedPrompt, module.getImageRatio(), count, modelOverride);
            }
            default -> {
                log.info("Vendor {} not yet implemented, skip generation", vendor);
                yield Collections.emptyList();
            }
        };
    }
}
