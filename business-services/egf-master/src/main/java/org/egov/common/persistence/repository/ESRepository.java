package org.egov.common.persistence.repository;

import static org.elasticsearch.index.query.QueryBuilders.termsQuery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.common.domain.exception.InvalidDataException;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.stereotype.Repository;

@Repository
public abstract class ESRepository {

    protected TransportClient esClient;

    public void validateSortByOrder(final String sortBy) {
        List<String> sortByList = new ArrayList<String>();
        InvalidDataException invalidDataException = new InvalidDataException();
        if (sortBy.contains(",")) {
            sortByList = Arrays.asList(sortBy.split(","));
        } else {
            sortByList = Arrays.asList(sortBy);
        }
        for (String s : sortByList) {
            if (s.contains(" ")
                    && (!s.toLowerCase().trim().endsWith("asc") && !s.toLowerCase().trim().endsWith("desc"))) {
                invalidDataException.setFieldName(s.split(" ")[0]);
                invalidDataException
                        .setMessageKey("Please send the proper sortBy order for the field " + s.split(" ")[0]);
                throw invalidDataException;
            }
        }

    }

    public void validateEntityFieldName(String sortBy, final Class<?> object) {
        InvalidDataException invalidDataException = new InvalidDataException();
        List<String> sortByList = new ArrayList<String>();
        if (sortBy.contains(",")) {
            sortByList = Arrays.asList(sortBy.split(","));
        } else {
            sortByList = Arrays.asList(sortBy);
        }
        Boolean isFieldExist = Boolean.FALSE;
        for (String s : sortByList) {
            for (int i = 0; i < object.getDeclaredFields().length; i++) {
                if (object.getDeclaredFields()[i].getName().equals(s.contains(" ") ? s.split(" ")[0] : s)) {
                    isFieldExist = Boolean.TRUE;
                    break;
                } else {
                    isFieldExist = Boolean.FALSE;
                }
            }
            if (!isFieldExist) {
                invalidDataException.setFieldName(s.contains(" ") ? s.split(" ")[0] : s);
                invalidDataException.setMessageKey("Please send the proper Field Names ");
                throw invalidDataException;
            }
        }

    }

    public List<String> prepareOrderBys(String sortBy) {
        List<String> orderByList = new ArrayList<String>();
        List<String> sortByList = new ArrayList<String>();
        if (sortBy.contains(",")) {
            sortByList = Arrays.asList(sortBy.split(","));
        } else {
            sortByList = Arrays.asList(sortBy);
        }
        for (String s : sortByList) {
            if (s.contains(" ")
                    && (s.toLowerCase().trim().endsWith("asc") || s.toLowerCase().trim().endsWith("desc"))) {
                orderByList.add(s.trim());
            } else {
                orderByList.add(s.trim() + " asc");
            }
        }

        return orderByList;
    }

    public void add(Object fieldValue, String field, BoolQueryBuilder boolQueryBuilder) {
        if (fieldValue != null) {
            boolQueryBuilder = boolQueryBuilder.filter(termsQuery(field, fieldValue));
        }

    }

    public void in(List fieldValue, String field, BoolQueryBuilder boolQueryBuilder) {
        if (fieldValue != null) {
            boolQueryBuilder.filter(QueryBuilders.termsQuery(field, fieldValue));
        }

    }

    public void gte(Object fieldValue, String field, BoolQueryBuilder boolQueryBuilder) {
        if (fieldValue != null) {
            boolQueryBuilder = boolQueryBuilder.filter(QueryBuilders.rangeQuery(field).from(fieldValue));
        }

    }

    public void lte(Object fieldValue, String field, BoolQueryBuilder boolQueryBuilder) {
        if (fieldValue != null) {
            boolQueryBuilder = boolQueryBuilder.filter(QueryBuilders.rangeQuery(field).to(fieldValue));
        }

    }

}
