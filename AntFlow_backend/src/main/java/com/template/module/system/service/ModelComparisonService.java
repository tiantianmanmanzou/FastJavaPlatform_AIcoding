package com.template.module.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.common.response.PageResult;
import com.template.module.system.dto.ModelComparisonQueryRequest;
import com.template.module.system.dto.ModelComparisonRequest;
import com.template.module.system.dto.ModelComparisonVO;
import com.template.module.system.entity.ModelComparison;

public interface ModelComparisonService extends IService<ModelComparison> {

    PageResult<ModelComparisonVO> pageComparisons(ModelComparisonQueryRequest request);

    ModelComparisonVO getComparison(Long id);

    ModelComparisonVO createComparison(ModelComparisonRequest request);

    ModelComparisonVO updateComparison(Long id, ModelComparisonRequest request);

    void deleteComparison(Long id);

    ModelComparisonVO runComparison(Long id);
}
