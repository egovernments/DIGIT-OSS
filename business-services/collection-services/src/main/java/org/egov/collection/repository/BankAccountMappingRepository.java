/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.collection.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.collection.model.BankAccountServiceMapping;
import org.egov.collection.model.BankAccountServiceMappingSearchCriteria;
import org.egov.collection.repository.querybuilder.BankAccountServiceQueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class BankAccountMappingRepository {

    @Autowired
    private BankAccountServiceQueryBuilder bankAccountServiceQueryBuilder;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void persistBankAccountServiceMapping(List<BankAccountServiceMapping> bankAccountServiceMappings) {
        log.info("Create BankAccount Service Mapping Repository::" + bankAccountServiceMappings);
        final String bankAccountServiceInsertQuery = bankAccountServiceQueryBuilder.insertBankAccountServiceDetailsQuery();

        List<Map<String, Object>> bankAccountServiceBatchValues = new ArrayList<>(bankAccountServiceMappings.size());
        for (BankAccountServiceMapping bankAccountServiceMapping : bankAccountServiceMappings) {
            bankAccountServiceBatchValues
                    .add(new MapSqlParameterSource("businessdetails", bankAccountServiceMapping.getBusinessDetails())
                            .addValue("bankaccount", bankAccountServiceMapping.getBankAccount())
                            .addValue("bank", bankAccountServiceMapping.getBank())
                            .addValue("bankbranch", bankAccountServiceMapping.getBankBranch())
                            .addValue("active", true)
                            .addValue("createdby", bankAccountServiceMapping.getCreatedBy())
                            .addValue("lastmodifiedby", bankAccountServiceMapping.getLastModifiedBy())
                            .addValue("createddate", new Date().getTime())
                            .addValue("lastmodifieddate", new Date().getTime())
                            .addValue("tenantid", bankAccountServiceMapping.getTenantId()).getValues());
        }
        try {
            namedParameterJdbcTemplate.batchUpdate(bankAccountServiceInsertQuery,
                    bankAccountServiceBatchValues.toArray(new Map[bankAccountServiceMappings.size()]));
        } catch (Exception e) {
            log.error("Error in inserting bank Account service mapping data", e);
        }
    }

    public List<BankAccountServiceMapping> searchBankAccountServicemapping(
            final BankAccountServiceMappingSearchCriteria searchCriteria) {

        Map<String, Object> paramValues = new HashMap<>();
        String searchQuery = bankAccountServiceQueryBuilder.BankAccountServiceMappingSearchQuery(searchCriteria, paramValues);
        List<BankAccountServiceMapping> bankAccountServiceMappings = new ArrayList<BankAccountServiceMapping>();
        BeanPropertyRowMapper rowMapper = new BeanPropertyRowMapper(BankAccountServiceMapping.class);

        try {
            bankAccountServiceMappings = namedParameterJdbcTemplate.query(searchQuery, paramValues, rowMapper);
        } catch (Exception e) {
            log.error("Error while searching bank account service mapping :", e);
        }
        return bankAccountServiceMappings;
    }

    public List<Long> searchBankAccountBranches(final String tenantId) {
        String searchQuery = bankAccountServiceQueryBuilder.getAllBankAccountsForServiceQuery();
        return jdbcTemplate.queryForList(
                searchQuery, Long.class, new Object[] { tenantId });
    }
}
