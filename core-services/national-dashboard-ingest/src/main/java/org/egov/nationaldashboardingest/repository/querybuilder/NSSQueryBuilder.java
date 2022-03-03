package org.egov.nationaldashboardingest.repository.querybuilder;

import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;

@Component
public class NSSQueryBuilder {

    public String getNSSSearchQuery(List<String> keyData, List<Object> preparedStmtList){
        StringBuilder query = new StringBuilder("SELECT EXISTS(SELECT uuid FROM nss_ingest_data WHERE ");

        if(!CollectionUtils.isEmpty(keyData)){
            query.append(" datakey ");
            query.append("  IN ( ").append(createQuery(keyData)).append(" )");
            addToPreparedStatement(preparedStmtList, keyData);
        }

        query.append(" ) ");

        return query.toString();
    }

    private String createQuery(List<String> ids) {
        StringBuilder builder = new StringBuilder();
        int length = ids.size();
        for (int i = 0; i < length; i++) {
            builder.append(" ?");
            if (i != length - 1)
                builder.append(",");
        }
        return builder.toString();
    }

    private void addToPreparedStatement(List<Object> preparedStmtList, List<String> ids) {
        ids.forEach(id -> {
            preparedStmtList.add(id);
        });
    }

}
