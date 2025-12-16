package com.template.module.product.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.common.response.PageResult;
import com.template.module.product.dto.ProductCreateRequest;
import com.template.module.product.dto.ProductImageRequest;
import com.template.module.product.dto.ProductImageVO;
import com.template.module.product.dto.ProductQueryRequest;
import com.template.module.product.dto.ProductSimpleVO;
import com.template.module.product.dto.ProductUpdateRequest;
import com.template.module.product.dto.ProductVO;
import com.template.module.product.entity.Product;
import java.util.List;

public interface ProductService extends IService<Product> {

    PageResult<ProductVO> pageProducts(ProductQueryRequest request);

    ProductVO createProduct(ProductCreateRequest request);

    ProductVO updateProduct(Long id, ProductUpdateRequest request);

    void deleteProduct(Long id);

    List<ProductSimpleVO> listSimpleProducts();

    ProductVO getProduct(Long id);

    List<ProductImageVO> addProductImages(Long productId, List<ProductImageRequest> requests);

    void deleteProductImage(Long productId, Long imageId);

    List<ProductImageVO> setPrimaryImage(Long productId, Long imageId);
}
