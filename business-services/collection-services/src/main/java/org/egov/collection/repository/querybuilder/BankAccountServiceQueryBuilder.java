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
package org.egov.collection.repository.querybuilder;

import java.util.List;
import java.util.Map;

import org.egov.collection.model.BankAccountServiceMappingSearchCriteria;
import org.springframework.stereotype.Component;

@Component
public class BankAccountServiceQueryBuilder {

    public String insertBankAccountServiceDetailsQuery() {
        return "INSERT INTO egcl_bankaccountservicemapping (id, businessdetails, bankaccount, bank, bankbranch, active, createdby, lastmodifiedby, createddate, lastmodifieddate, tenantid) values"
                + "(nextval('seq_egcl_bankaccountservicemapping'), :businessdetails, :bankaccount, :bank, :bankbranch, :active, :createdby, :lastmodifiedby, :createddate, :lastmodifieddate, :tenantid)";
    }

    public String BankAccountServiceMappingSearchQuery(final BankAccountServiceMappingSearchCriteria searchCriteria,
            final Map<String, Object> paramValues) {
        StringBuilder searchQuery = new StringBuilder();
        searchQuery.append("select * from egcl_bankaccountservicemapping where tenantid =:tenantId");
        paramValues.put("tenantId", searchCriteria.getTenantId());

        if (searchCriteria.getBusinessDetails() != null && !searchCriteria.getBusinessDetails().isEmpty()) {
            searchQuery.append(" and businessdetails ilike any  "
                    + getStringAppendQuery(searchCriteria.getBusinessDetails()));
        }

        if (searchCriteria.getBankAccount() != null) {
            searchQuery.append(" and bankaccount =:bankaccount");
            paramValues.put("bankaccount", searchCriteria.getBankAccount());
        }
        
        if (searchCriteria.getBank() != null) {
            searchQuery.append(" and bank =:bank");
            paramValues.put("bank", searchCriteria.getBank());
        }
        
        if (searchCriteria.getBankBranch() != null) {
            searchQuery.append(" and bankBranch =:bankBranch");
            paramValues.put("bankBranch", searchCriteria.getBankBranch());
        }

        searchQuery.append(" order by businessdetails");
        return searchQuery.toString();
    }

    private static String getStringAppendQuery(List<String> receiptNumbersList) {
        StringBuilder query = new StringBuilder("(array [");

        if (receiptNumbersList.size() >= 1) {
            query.append("'%").append(receiptNumbersList.get(0).toString()).append("%'");
            for (int i = 1; i < receiptNumbersList.size(); i++) {
                query.append(", '%" + receiptNumbersList.get(i) + "%'");
            }
        }
        return query.append("])").toString();
    }

    public String getAllBankAccountsForServiceQuery() {
        return "select distinct(bankaccount) bankAccount from egcl_bankaccountservicemapping where tenantId=:tenantId";
    }
}
