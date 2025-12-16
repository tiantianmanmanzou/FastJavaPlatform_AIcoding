package com.template.module.product.controller;

import com.template.common.response.PageResult;
import com.template.common.response.Result;
import com.template.module.product.dto.ProductCreateRequest;
import com.template.module.product.dto.ProductImageRequest;
import com.template.module.product.dto.ProductImageVO;
import com.template.module.product.dto.ProductQueryRequest;
import com.template.module.product.dto.ProductSimpleVO;
import com.template.module.product.dto.ProductUpdateRequest;
import com.template.module.product.dto.ProductVO;
import com.template.module.product.service.ProductService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Validated
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public PageResult<ProductVO> page(ProductQueryRequest request) {
        return productService.pageProducts(request);
    }

    @GetMapping("/{id}")
    public Result<ProductVO> detail(@PathVariable Long id) {
        return Result.success(productService.getProduct(id));
    }

    @PostMapping
    public Result<ProductVO> create(@Valid @RequestBody ProductCreateRequest request) {
        return Result.success(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public Result<ProductVO> update(@PathVariable Long id, @Valid @RequestBody ProductUpdateRequest request) {
        return Result.success(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return Result.success();
    }

    @PostMapping("/{id}/images")
    public Result<List<ProductImageVO>> addImages(@PathVariable Long id, @RequestBody List<@Valid ProductImageRequest> requests) {
        return Result.success(productService.addProductImages(id, requests));
    }

    @DeleteMapping("/{productId}/images/{imageId}")
    public Result<Void> deleteImage(@PathVariable Long productId, @PathVariable Long imageId) {
        productService.deleteProductImage(productId, imageId);
        return Result.success();
    }

    @PutMapping("/{productId}/images/{imageId}/primary")
    public Result<List<ProductImageVO>> setPrimary(@PathVariable Long productId, @PathVariable Long imageId) {
        return Result.success(productService.setPrimaryImage(productId, imageId));
    }

    @GetMapping("/simple")
    public Result<List<ProductSimpleVO>> simpleList() {
        return Result.success(productService.listSimpleProducts());
    }
}
