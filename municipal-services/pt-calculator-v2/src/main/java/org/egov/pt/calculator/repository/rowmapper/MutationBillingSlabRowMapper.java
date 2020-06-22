package org.egov.pt.calculator.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.pt.calculator.web.models.MutationBillingSlab;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class MutationBillingSlabRowMapper implements ResultSetExtractor<List<MutationBillingSlab>> {
    @Override
    public List<MutationBillingSlab> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String, MutationBillingSlab> billingSlabMap = new HashMap<>();
        while (rs.next()) {
            String currentId = rs.getString("id");
            MutationBillingSlab currentBillingSlab = billingSlabMap.get(currentId);
            if (null == currentBillingSlab) {

                currentBillingSlab = MutationBillingSlab.builder().id(rs.getString("id")).tenantId(rs.getString("tenantId"))
                        .propertyType(rs.getString("propertyType")).propertySubType(rs.getString("propertySubType"))
                        .usageCategoryMajor(rs.getString("usageCategoryMajor")).usageCategoryMinor(rs.getString("usageCategoryMinor"))
                        .usageCategorySubMinor(rs.getString("usageCategorySubMinor")).usageCategoryDetail(rs.getString("usageCategoryDetail"))
                        .ownerShipCategory(rs.getString("ownerShipCategory")).subOwnerShipCategory(rs.getString("subOwnerShipCategory"))
                        .minMarketValue(rs.getDouble("minMarketValue")).maxMarketValue(rs.getDouble("maxMarketValue"))
                        .fixedAmount(rs.getDouble("fixedAmount")).rate(rs.getDouble("rate")).type(MutationBillingSlab.TypeEnum.fromValue(rs.getString("method"))).build();

                billingSlabMap.put(currentId, currentBillingSlab);
            }

        }

        return new ArrayList<>(billingSlabMap.values());

    }

}
