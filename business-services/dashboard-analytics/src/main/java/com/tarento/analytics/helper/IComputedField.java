package com.tarento.analytics.helper;

import com.tarento.analytics.dto.AggregateRequestDto;

import java.util.List;

public interface IComputedField<T> {

    public void set(AggregateRequestDto requestDto, String postAggrTheoryName);
    public void add(T data, List<String> fields, String newField);

}
