package org.bel.birthdeath.common.repository.builder;

import java.util.List;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CommonQueryBuilder {


    private static final String QUERY_MASTER = "SELECT * FROM {schema}.eg_birth_death_hospitals bdtl";

    private static void addClauseIfRequired(List<Object> values, StringBuilder queryString) {
        if (values.isEmpty())
            queryString.append(" WHERE ");
        else {
            queryString.append(" AND");
        }
    }


	public String getHospitalDtls(String teantId, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(QUERY_MASTER);

		if (teantId != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" tenantid=? ");
			preparedStmtList.add(teantId);
		}
		return builder.toString();
	}

}
