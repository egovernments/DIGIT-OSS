package org.egov.common.util;

import static org.elasticsearch.index.query.QueryBuilders.termsQuery;

import java.util.List;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.stereotype.Service;

@Service
public class ElasticSearchUtils {

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