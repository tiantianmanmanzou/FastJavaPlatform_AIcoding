package com.template.module.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.response.PageResult;
import com.template.module.system.dto.ModelComparisonQueryRequest;
import com.template.module.system.dto.ModelComparisonRequest;
import com.template.module.system.dto.ModelComparisonVO;
import com.template.module.system.entity.ModelComparison;
import com.template.module.system.mapper.ModelComparisonMapper;
import com.template.module.system.service.ModelComparisonService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ModelComparisonServiceImpl extends ServiceImpl<ModelComparisonMapper, ModelComparison>
    implements ModelComparisonService {

    @Override
    public PageResult<ModelComparisonVO> pageComparisons(ModelComparisonQueryRequest request) {
        Page<ModelComparison> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<ModelComparison> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(request.getKeyword())) {
            wrapper.and(qw -> qw.like(ModelComparison::getComparisonName, request.getKeyword())
                .or().like(ModelComparison::getPrompt, request.getKeyword())
                .or().like(ModelComparison::getEvaluationCriteria, request.getKeyword()));
        }
        if (StringUtils.hasText(request.getStatus())) {
            wrapper.eq(ModelComparison::getStatus, request.getStatus());
        }
        wrapper.orderByDesc(ModelComparison::getUpdateTime);
        this.page(page, wrapper);
        List<ModelComparisonVO> records = page.getRecords().stream()
            .map(this::toVO)
            .collect(Collectors.toList());
        return PageResult.of(records, page.getTotal(), page.getCurrent(), page.getSize());
    }

    @Override
    public ModelComparisonVO getComparison(Long id) {
        ModelComparison comparison = getById(id);
        if (comparison == null) {
            throw new BusinessException(ErrorCode.MODEL_COMPARISON_NOT_FOUND);
        }
        return toVO(comparison);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ModelComparisonVO createComparison(ModelComparisonRequest request) {
        ModelComparison comparison = new ModelComparison();
        BeanUtils.copyProperties(request, comparison);
        comparison.setStatus("PENDING");
        comparison.setCreateTime(LocalDateTime.now());
        comparison.setUpdateTime(LocalDateTime.now());
        save(comparison);
        return toVO(comparison);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ModelComparisonVO updateComparison(Long id, ModelComparisonRequest request) {
        ModelComparison comparison = getById(id);
        if (comparison == null) {
            throw new BusinessException(ErrorCode.MODEL_COMPARISON_NOT_FOUND);
        }
        BeanUtils.copyProperties(request, comparison);
        comparison.setUpdateTime(LocalDateTime.now());
        updateById(comparison);
        return toVO(comparison);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteComparison(Long id) {
        boolean removed = removeById(id);
        if (!removed) {
            throw new BusinessException(ErrorCode.MODEL_COMPARISON_NOT_FOUND);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ModelComparisonVO runComparison(Long id) {
        ModelComparison comparison = getById(id);
        if (comparison == null) {
            throw new BusinessException(ErrorCode.MODEL_COMPARISON_NOT_FOUND);
        }
        comparison.setStatus("RUNNING");
        updateById(comparison);

        ThreadLocalRandom random = ThreadLocalRandom.current();
        int latencyA = random.nextInt(600, 3000);
        int latencyB = random.nextInt(600, 3000);
        int tokensInput = random.nextInt(800, 2000);
        int tokensOutputA = random.nextInt(400, 1200);
        int tokensOutputB = random.nextInt(400, 1200);

        String summaryPrompt = comparison.getPrompt().length() > 120
            ? comparison.getPrompt().substring(0, 120) + "..."
            : comparison.getPrompt();
        String resultA = String.format("模型 %s 输出摘要:\n%s\n---\n模拟完成", defaultString(comparison.getModelA(), "A"), summaryPrompt);
        String resultB = String.format("模型 %s 输出摘要:\n%s\n---\n模拟完成", defaultString(comparison.getModelB(), "B"), summaryPrompt);

        BigDecimal scoreA = BigDecimal.valueOf(random.nextDouble(70, 98)).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal scoreB = BigDecimal.valueOf(random.nextDouble(70, 98)).setScale(2, java.math.RoundingMode.HALF_UP);
        String winner;
        String verdict;
        if (scoreA.compareTo(scoreB) > 0) {
            winner = comparison.getModelA();
            verdict = "MODEL_A_BETTER";
        } else if (scoreA.compareTo(scoreB) < 0) {
            winner = comparison.getModelB();
            verdict = "MODEL_B_BETTER";
        } else {
            winner = "平局";
            verdict = "TIE";
        }

        comparison.setResultA(resultA);
        comparison.setResultB(resultB);
        comparison.setScoreA(scoreA);
        comparison.setScoreB(scoreB);
        comparison.setWinner(winner);
        comparison.setVerdict(verdict);
        comparison.setEvaluationNotes("模型输出由系统模拟生成，仅供演示使用");
        comparison.setLatencyA(latencyA);
        comparison.setLatencyB(latencyB);
        comparison.setInputTokensA(tokensInput);
        comparison.setInputTokensB(tokensInput);
        comparison.setOutputTokensA(tokensOutputA);
        comparison.setOutputTokensB(tokensOutputB);
        comparison.setStatus("COMPLETED");
        comparison.setUpdateTime(LocalDateTime.now());
        updateById(comparison);
        return toVO(comparison);
    }

    private ModelComparisonVO toVO(ModelComparison entity) {
        ModelComparisonVO vo = new ModelComparisonVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

    private String defaultString(String value, String fallback) {
        return StringUtils.hasText(value) ? value : fallback;
    }
}
