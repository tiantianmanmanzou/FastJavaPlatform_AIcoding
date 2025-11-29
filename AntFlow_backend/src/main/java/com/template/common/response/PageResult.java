package com.template.common.response;

import java.util.List;

public class PageResult<T> extends Result<PageResult.PageData<T>> {

    private PageResult(PageData<T> data) {
        super(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), data);
    }

    public static <T> PageResult<T> of(List<T> list, long total, long page, long pageSize) {
        return new PageResult<>(new PageData<>(list, total, page, pageSize));
    }

    public record PageData<T>(List<T> list, long total, long page, long pageSize) {
    }
}
