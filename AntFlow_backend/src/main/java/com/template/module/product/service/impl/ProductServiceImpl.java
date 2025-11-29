package com.template.module.product.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.constants.CommonConstants;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.response.PageResult;
import com.template.module.product.dto.ProductCreateRequest;
import com.template.module.product.dto.ProductQueryRequest;
import com.template.module.product.dto.ProductSimpleVO;
import com.template.module.product.dto.ProductUpdateRequest;
import com.template.module.product.dto.ProductVO;
import com.template.module.product.entity.Product;
import com.template.module.product.mapper.ProductMapper;
import com.template.module.product.service.ProductService;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

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
        List<ProductVO> records = page.getRecords().stream()
            .map(this::toVO)
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
        product.setCoverImageUrl(request.getCoverImageUrl());
        product.setOriginImageUrl(request.getOriginImageUrl());
        product.setTags(joinTags(request.getTags()));
        product.setStatus(request.getStatus() == null ? CommonConstants.STATUS_ENABLED : request.getStatus());
        save(product);
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
        product.setCoverImageUrl(request.getCoverImageUrl());
        product.setOriginImageUrl(request.getOriginImageUrl());
        product.setTags(joinTags(request.getTags()));
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        updateById(product);
        return getProduct(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Long id) {
        boolean removed = removeById(id);
        if (!removed) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
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
        return products.stream()
            .map(product -> ProductSimpleVO.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .productType(product.getProductType())
                .coverImageUrl(product.getCoverImageUrl())
                .originImageUrl(product.getOriginImageUrl())
                .description(product.getDescription())
                .build())
            .collect(Collectors.toList());
    }

    @Override
    public ProductVO getProduct(Long id) {
        Product product = getById(id);
        if (product == null) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        return toVO(product);
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

    private ProductVO toVO(Product product) {
        return ProductVO.builder()
            .id(product.getId())
            .productName(product.getProductName())
            .productCode(product.getProductCode())
            .productType(product.getProductType())
            .description(product.getDescription())
            .coverImageUrl(product.getCoverImageUrl())
            .originImageUrl(product.getOriginImageUrl())
            .tags(splitTags(product.getTags()))
            .status(product.getStatus())
            .createTime(product.getCreateTime())
            .updateTime(product.getUpdateTime())
            .build();
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
