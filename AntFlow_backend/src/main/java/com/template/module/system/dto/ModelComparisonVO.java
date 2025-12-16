package com.template.module.system.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ModelComparisonVO {

    private Long id;
    private String comparisonName;
    private String prompt;
    private String providerA;
    private String modelA;
    private String providerB;
    private String modelB;
    private String evaluationCriteria;
    private String status;
    private String resultA;
    private String resultB;
    private BigDecimal scoreA;
    private BigDecimal scoreB;
    private String verdict;
    private String winner;
    private String evaluationNotes;
    private Integer latencyA;
    private Integer latencyB;
    private Integer inputTokensA;
    private Integer inputTokensB;
    private Integer outputTokensA;
    private Integer outputTokensB;
    private String createdBy;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
