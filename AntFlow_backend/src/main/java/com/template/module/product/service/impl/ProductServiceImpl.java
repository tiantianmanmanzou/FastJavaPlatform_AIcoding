package com.template.module.product.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.constants.CommonConstants;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.response.PageResult;
import com.template.common.storage.FileStorageService;
import com.template.module.product.dto.ProductCreateRequest;
import com.template.module.product.dto.ProductImageRequest;
import com.template.module.product.dto.ProductImageVO;
import com.template.module.product.dto.ProductQueryRequest;
import com.template.module.product.dto.ProductSimpleVO;
import com.template.module.product.dto.ProductUpdateRequest;
import com.template.module.product.dto.ProductVO;
import com.template.module.product.entity.Product;
import com.template.module.product.entity.ProductImage;
import com.template.module.product.mapper.ProductImageMapper;
import com.template.module.product.mapper.ProductMapper;
import com.template.module.product.service.ProductService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    private final ProductImageMapper productImageMapper;
    private final FileStorageService fileStorageService;

    @Override
    public PageResult<ProductVO> pageProducts(ProductQueryRequest request) {
        Page<Product> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(request.getKeyword())) {
            wrapper.and(qw -> qw.like(Product::getProductName, request.getKeyword())
                .or().like(Product::getDescription, request.getKeyword()));
        }
        if (StringUtils.hasText(request.getProductType())) {
            wrapper.eq(Product::getProductType, request.getProductType());
        }
        if (request.getStatus() != null) {
            wrapper.eq(Product::getStatus, request.getStatus());
        }
        wrapper.orderByDesc(Product::getUpdateTime);
        this.page(page, wrapper);
        List<Product> recordsRaw = page.getRecords();
        Map<Long, List<ProductImage>> imageMap = loadImages(recordsRaw.stream().map(Product::getId).collect(Collectors.toList()));
        List<ProductVO> records = recordsRaw.stream()
            .map(product -> toVO(product, imageMap.getOrDefault(product.getId(), Collections.emptyList())))
            .collect(Collectors.toList());
        return PageResult.of(records, page.getTotal(), page.getCurrent(), page.getSize());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductVO createProduct(ProductCreateRequest request) {
        Product product = new Product();
        String code = resolveProductCode(request.getProductName(), request.getProductCode());
        ensureCodeUnique(code, null);
        product.setProductCode(code);
        product.setProductName(request.getProductName());
        product.setProductType(request.getProductType());
        product.setDescription(request.getDescription());
        product.setTags(joinTags(request.getTags()));
        product.setStatus(request.getStatus() == null ? CommonConstants.STATUS_ENABLED : request.getStatus());
        save(product);
        replaceProductImages(product.getId(), request.getImages());
        return getProduct(product.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductVO updateProduct(Long id, ProductUpdateRequest request) {
        Product product = getById(id);
        if (product == null) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        String code = resolveProductCode(request.getProductName(),
            StringUtils.hasText(request.getProductCode()) ? request.getProductCode() : product.getProductCode());
        ensureCodeUnique(code, id);
        product.setProductCode(code);
        product.setProductName(request.getProductName());
        product.setProductType(request.getProductType());
        product.setDescription(request.getDescription());
        product.setTags(joinTags(request.getTags()));
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        updateById(product);
        replaceProductImages(id, request.getImages());
        return getProduct(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Long id) {
        boolean removed = removeById(id);
        if (!removed) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        productImageMapper.delete(new LambdaQueryWrapper<ProductImage>().eq(ProductImage::getProductId, id));
    }

    @Override
    public List<ProductSimpleVO> listSimpleProducts() {
        List<Product> products = lambdaQuery()
            .orderByDesc(Product::getUpdateTime)
            .last("limit 100")
            .list();
        if (products.isEmpty()) {
            return Collections.emptyList();
        }
        Map<Long, List<ProductImage>> imageMap = loadImages(products.stream().map(Product::getId).collect(Collectors.toList()));
        return products.stream()
            .map(product -> {
                List<ProductImage> images = imageMap.getOrDefault(product.getId(), Collections.emptyList());
                return ProductSimpleVO.builder()
                    .id(product.getId())
                    .productName(product.getProductName())
                    .productType(product.getProductType())
                    .description(product.getDescription())
                    .mainImageUrl(determineMainImageUrl(images))
                    .imageCount(images.size())
                    .imageUrls(images.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()))
                    .build();
            })
            .collect(Collectors.toList());
    }

    @Override
    public ProductVO getProduct(Long id) {
        Product product = getById(id);
        if (product == null) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        List<ProductImage> images = productImageMapper.selectList(new LambdaQueryWrapper<ProductImage>().eq(ProductImage::getProductId, id)
            .orderByDesc(ProductImage::getPrimaryFlag)
            .orderByAsc(ProductImage::getId));
        return toVO(product, images);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<ProductImageVO> addProductImages(Long productId, List<ProductImageRequest> requests) {
        Product product = getById(productId);
        if (product == null) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        if (requests == null || requests.isEmpty()) {
            return Collections.emptyList();
        }
        List<ProductImage> existing = productImageMapper.selectList(new LambdaQueryWrapper<ProductImage>().eq(ProductImage::getProductId, productId));
        boolean hasPrimary = existing.stream().anyMatch(img -> Boolean.TRUE.equals(img.getPrimaryFlag()));
        boolean newPrimarySpecified = false;
        List<ProductImage> toInsert = new ArrayList<>();
        for (ProductImageRequest request : requests) {
            String normalized = normalizeImageUrl(request.getImageUrl());
            if (!StringUtils.hasText(normalized)) {
                continue;
            }
            ProductImage image = new ProductImage();
            image.setProductId(productId);
            image.setImageUrl(normalized);
            boolean primary = Boolean.TRUE.equals(request.getPrimary()) && !newPrimarySpecified;
            image.setPrimaryFlag(primary);
            if (primary) {
                hasPrimary = true;
                newPrimarySpecified = true;
            }
            toInsert.add(image);
        }
        if (!hasPrimary && !toInsert.isEmpty()) {
            toInsert.get(0).setPrimaryFlag(true);
            newPrimarySpecified = true;
        }
        if (newPrimarySpecified) {
            LambdaUpdateWrapper<ProductImage> resetWrapper = new LambdaUpdateWrapper<>();
            resetWrapper.eq(ProductImage::getProductId, productId).set(ProductImage::getPrimaryFlag, false);
            productImageMapper.update(null, resetWrapper);
        }
        for (ProductImage image : toInsert) {
            productImageMapper.insert(image);
        }
        List<ProductImage> images = productImageMapper.selectList(new LambdaQueryWrapper<ProductImage>().eq(ProductImage::getProductId, productId)
            .orderByDesc(ProductImage::getPrimaryFlag)
            .orderByAsc(ProductImage::getId));
        return toImageVOs(images);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProductImage(Long productId, Long imageId) {
        ProductImage image = productImageMapper.selectById(imageId);
        if (image == null || !image.getProductId().equals(productId)) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        boolean wasPrimary = Boolean.TRUE.equals(image.getPrimaryFlag());
        productImageMapper.deleteById(imageId);
        if (wasPrimary) {
            List<ProductImage> remaining = productImageMapper.selectList(new LambdaQueryWrapper<ProductImage>().eq(ProductImage::getProductId, productId)
                .orderByAsc(ProductImage::getId));
            if (!remaining.isEmpty()) {
                ProductImage first = remaining.get(0);
                first.setPrimaryFlag(true);
                productImageMapper.updateById(first);
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<ProductImageVO> setPrimaryImage(Long productId, Long imageId) {
        ProductImage image = productImageMapper.selectById(imageId);
        if (image == null || !image.getProductId().equals(productId)) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        LambdaUpdateWrapper<ProductImage> resetWrapper = new LambdaUpdateWrapper<>();
        resetWrapper.eq(ProductImage::getProductId, productId).set(ProductImage::getPrimaryFlag, false);
        productImageMapper.update(null, resetWrapper);
        image.setPrimaryFlag(true);
        productImageMapper.updateById(image);
        List<ProductImage> images = productImageMapper.selectList(new LambdaQueryWrapper<ProductImage>().eq(ProductImage::getProductId, productId)
            .orderByDesc(ProductImage::getPrimaryFlag)
            .orderByAsc(ProductImage::getId));
        return toImageVOs(images);
    }

    private void ensureCodeUnique(String code, Long excludeId) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getProductCode, code);
        if (excludeId != null) {
            wrapper.ne(Product::getId, excludeId);
        }
        boolean exists = this.count(wrapper) > 0;
        if (exists) {
            throw new BusinessException(ErrorCode.PRODUCT_CODE_DUPLICATED);
        }
    }

    private String resolveProductCode(String productName, String customCode) {
        if (StringUtils.hasText(customCode)) {
            return customCode.trim().toUpperCase(Locale.ROOT);
        }
        String base = productName == null ? "PRD" : productName.replaceAll("[^a-zA-Z0-9]", "-");
        base = base.replaceAll("-+", "-").replaceAll("^-|-$", "").toUpperCase(Locale.ROOT);
        if (!StringUtils.hasText(base)) {
            base = "PRD";
        }
        String candidate = base;
        int suffix = 1;
        while (lambdaQuery().eq(Product::getProductCode, candidate).exists()) {
            candidate = base + "-" + (++suffix);
        }
        return candidate;
    }

    private ProductVO toVO(Product product, List<ProductImage> images) {
        return ProductVO.builder()
            .id(product.getId())
            .productName(product.getProductName())
            .productCode(product.getProductCode())
            .productType(product.getProductType())
            .description(product.getDescription())
            .tags(splitTags(product.getTags()))
            .status(product.getStatus())
            .images(toImageVOs(images))
            .createTime(product.getCreateTime())
            .updateTime(product.getUpdateTime())
            .build();
    }

    private List<ProductImageVO> toImageVOs(List<ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return Collections.emptyList();
        }
        return images.stream()
            .map(img -> ProductImageVO.builder()
                .id(img.getId())
                .imageUrl(img.getImageUrl())
                .primary(Boolean.TRUE.equals(img.getPrimaryFlag()))
                .createTime(img.getCreateTime())
                .updateTime(img.getUpdateTime())
                .build())
            .collect(Collectors.toList());
    }

    private Map<Long, List<ProductImage>> loadImages(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return Collections.emptyMap();
        }
        List<ProductImage> images = productImageMapper.selectList(new LambdaQueryWrapper<ProductImage>().in(ProductImage::getProductId, productIds)
            .orderByDesc(ProductImage::getPrimaryFlag)
            .orderByAsc(ProductImage::getId));
        Map<Long, List<ProductImage>> map = new HashMap<>();
        for (ProductImage image : images) {
            map.computeIfAbsent(image.getProductId(), key -> new ArrayList<>()).add(image);
        }
        return map;
    }

    private void replaceProductImages(Long productId, List<ProductImageRequest> images) {
        productImageMapper.delete(new LambdaQueryWrapper<ProductImage>().eq(ProductImage::getProductId, productId));
        if (images == null || images.isEmpty()) {
            return;
        }
        boolean primaryAssigned = false;
        List<ProductImageRequest> ordered = new ArrayList<>();
        for (ProductImageRequest request : images) {
            String normalized = normalizeImageUrl(request.getImageUrl());
            if (!StringUtils.hasText(normalized)) {
                continue;
            }
            ProductImageRequest adjusted = new ProductImageRequest();
            adjusted.setImageUrl(normalized);
            adjusted.setPrimary(request.getPrimary());
            ordered.add(adjusted);
        }
        if (ordered.isEmpty()) {
            return;
        }
        for (int i = 0; i < ordered.size(); i++) {
            ProductImageRequest request = ordered.get(i);
            if (Boolean.TRUE.equals(request.getPrimary()) && !primaryAssigned) {
                primaryAssigned = true;
            } else if (Boolean.TRUE.equals(request.getPrimary()) && primaryAssigned) {
                request.setPrimary(false);
            }
            if (i == ordered.size() - 1 && !primaryAssigned) {
                request.setPrimary(true);
                primaryAssigned = true;
            }
        }
        for (ProductImageRequest request : ordered) {
            ProductImage image = new ProductImage();
            image.setProductId(productId);
            image.setImageUrl(request.getImageUrl());
            image.setPrimaryFlag(Boolean.TRUE.equals(request.getPrimary()));
            productImageMapper.insert(image);
        }
    }

    private String determineMainImageUrl(List<ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return null;
        }
        return images.stream()
            .sorted((a, b) -> Boolean.compare(Boolean.TRUE.equals(b.getPrimaryFlag()), Boolean.TRUE.equals(a.getPrimaryFlag())))
            .findFirst()
            .map(ProductImage::getImageUrl)
            .orElse(null);
    }

    private String normalizeImageUrl(String imageUrl) {
        if (!StringUtils.hasText(imageUrl)) {
            return imageUrl;
        }
        return fileStorageService.ensureAccessibleUrl(imageUrl);
    }

    private List<String> splitTags(String tags) {
        if (!StringUtils.hasText(tags)) {
            return Collections.emptyList();
        }
        return Arrays.stream(tags.split(","))
            .map(String::trim)
            .filter(StringUtils::hasText)
            .collect(Collectors.toList());
    }

    private String joinTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return null;
        }
        return tags.stream()
            .filter(StringUtils::hasText)
            .map(tag -> tag.trim())
            .filter(StringUtils::hasText)
            .collect(Collectors.joining(","));
    }
}
