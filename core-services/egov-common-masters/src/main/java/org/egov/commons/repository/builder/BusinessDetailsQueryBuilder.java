package org.egov.commons.repository.builder;

import java.util.List;

import org.egov.commons.model.BusinessDetailsCriteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import lombok.EqualsAndHashCode;

@Component
@EqualsAndHashCode
public class BusinessDetailsQueryBuilder {
	private static final Logger logger = LoggerFactory.getLogger(BusinessDetailsQueryBuilder.class);

	private static final String BASE_QUERY = "Select bd.id as bd_id,bd.name as bd_name,bd.businessurl as bd_url,"
			+ "bd.isenabled as bd_enabled,bd.code as bd_code,bd.businesstype as bd_type,"
			+ "bd.fund as bd_fund,bd.function as bd_function,bd.fundsource as bd_fundsource,"
			+ "bd.functionary as bd_functionary,bd.department as bd_department,bd.callbackforapportioning as bd_callback,"
			+ "bd.vouchercreation as bd_vouc_creation,bd.businesscategory as bd_category,"
			+ "bd.isvoucherapproved as bd_is_Vou_approved,bd.vouchercutoffdate as bd_vou_cutoffdate,"
			+ "bd.ordernumber as bd_ordernumber,bd.tenantid as bd_tenant,bad.id as bad_id,bad.businessdetails as bd_id,bad.chartofaccount"
			+ " as bad_chartofacc,bad.amount as bad_amount,bad.tenantid as bad_tenant,basd.id  as basd_id,"
			+ "basd.accountdetailtype as basd_detailtype,basd.accountdetailkey as basd_detailkey,basd.amount"
			+ " as basd_amount,basd.businessaccountdetail"
			+ " as basd_id,basd.tenantid as basd_tenant from eg_businesscategory bc FULL JOIN eg_businessdetails"
			+ " bd ON bc.id=bd.businesscategory FULL JOIN"
			+ " eg_business_accountdetails bad ON bd.id=bad.businessdetails"
			+ " FULL JOIN eg_business_subledgerinfo basd ON bad.id=basd.businessaccountdetail";


    public String insertBusinessDetailsQuery() {
        return "Insert into eg_businessdetails"
                + " (id,name,isEnabled,code,businessType,businessUrl,voucherCutOffDate,"
                + "ordernumber,voucherCreation,isVoucherApproved,fund,department,"
                + "fundSource,functionary,businessCategory,function,callBackForApportioning,tenantId,"
                + "createdBy,createdDate,lastModifiedBy,lastModifiedDate)" + " values (:id,:name,:enabled,:code,:businesstype,:businessurl,:vouchercutoffdate,"
                + ":ordernumber,:vouchercreation,:isVoucherApproved,:fund,:department,:fundSource,:functionary,:businessCategory,:function,:callBackForApportioning,"
                + ":tenantId,:createdBy,:createdDate,:lastModifiedBy,:lastModifiedDate)";
    }

    public String updateBusinessDetailsQuery() {
        return "Update eg_businessdetails"
                + " set name=:name,isEnabled=:enabled,code=:code,businessType=:businesstype,businessUrl=:businessurl,voucherCutOffDate=:vouchercutoffdate,"
                + "ordernumber=:ordernumber,voucherCreation=:vouchercreation,isVoucherApproved=:isVoucherApproved,fund=:fund,department=:department,"
                + "fundSource=:fundSource,functionary=:functionary,businessCategory=:businessCategory,function=:function,callBackForApportioning=:callBackForApportioning,"
                + "tenantId=:tenantId,lastModifiedBy=:lastModifiedBy,lastModifiedDate=:lastModifiedDate where id=:id";
    }

    public String deleteBusinessAccountDetails() {
        return "Delete from eg_business_accountdetails where businessDetails=:businessDetails";
    }

    public String insertBusinessAccountDetailsQuery() {
        return "Insert into eg_business_accountdetails"
                + " (id,businessDetails,chartOfAccount,amount,tenantId)" + " values (nextval('seq_eg_business_accountdetails'),:businessDetails,:chartOfAccount,:amount,:tenantId)";
    }

    public String updateBusinessAccountDetailsQuery() {
        return "Update eg_business_accountdetails"
                + " set businessDetails=:businessDetails,chartOfAccount=:chartOfAccount,amount=:amount,tenantId=:tenantId" + " where id=:id";
    }

    public String insertAccountSubLedgerDetails() {
        return "insert into eg_business_subledgerinfo"
                + " (id,amount,businessAccountDetail,accountDetailKey,accountDetailType,tenantId)"
                + " values (nextval('seq_eg_business_subledgerinfo'),:amount,:businessAccountDetail,:accountDetailKey,:accountDetailType,:tenantId)";
    }

    public String UpdateAccountSubLedgerDetails() {
        return "Update eg_business_subledgerinfo"
                + " set amount=?,businessAccountDetail=?,accountDetailKey=?,accountDetailType=?,"
                + " tenantId=? where id=?";
    }


	@SuppressWarnings("rawtypes")
	public String getQuery(BusinessDetailsCriteria detailsCriteria, List preparedStatementValues) {
		StringBuilder selectQuery = new StringBuilder(BASE_QUERY);

		addWhereClause(selectQuery, preparedStatementValues, detailsCriteria);
		addOrderByClause(selectQuery, detailsCriteria);

		logger.debug("Query : " + selectQuery);
		return selectQuery.toString();
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void addWhereClause(StringBuilder selectQuery, List preparedStatementValues,
			BusinessDetailsCriteria criteria) {

		if (criteria.getTenantId() == null)
			return;

		selectQuery.append(" WHERE");
		boolean isAppendAndClause = false;

		if (criteria.getTenantId() != null) {
			isAppendAndClause = true;
			selectQuery.append(" bd.tenantId = ?");
			preparedStatementValues.add(criteria.getTenantId());
		}

		if (criteria.getIds() != null) {
			isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
			selectQuery.append(" bd.id IN " + getIdQuery(criteria.getIds()));
		}

		if (criteria.getBusinessCategoryCode() != null) {
			isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
			selectQuery.append(" bc.code = ?");
			preparedStatementValues.add(criteria.getBusinessCategoryCode());
		}
		
		if (criteria.getBusinessType() != null) {
                    isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
                    selectQuery.append(" bd.businesstype = ?");
                    preparedStatementValues.add(criteria.getBusinessType());
                }

		if (criteria.getActive() != null) {
			isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
			selectQuery.append(" bd.isenabled = ?");
			preparedStatementValues.add(criteria.getActive());
		}

		if (criteria.getBusinessDetailsCodes() != null && !criteria.getBusinessDetailsCodes().isEmpty()) {
			isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
			selectQuery.append(" bd.code IN " + getCodeQuery(criteria.getBusinessDetailsCodes()));
		}
	}

	private void addOrderByClause(StringBuilder selectQuery, BusinessDetailsCriteria criteria) {
		String sortBy = (criteria.getSortBy() == null ? "bd.name" : "bd." + criteria.getSortBy());
		String sortOrder = (criteria.getSortOrder() == null ? "ASC" : criteria.getSortOrder());
		selectQuery.append(" ORDER BY " + sortBy + " " + sortOrder);
	}

	private boolean addAndClauseIfRequired(boolean appendAndClauseFlag, StringBuilder queryString) {
		if (appendAndClauseFlag)
			queryString.append(" AND");
		return true;
	}

	private static String getIdQuery(List<Long> idList) {
		StringBuilder query = new StringBuilder("(");
		if (idList.size() >= 1) {
			query.append(idList.get(0).toString());
			for (int i = 1; i < idList.size(); i++) {
				query.append(", " + idList.get(i));
			}
		}
		return query.append(")").toString();
	}

    private static String getCodeQuery(List<String> codeList) {
        StringBuilder query = new StringBuilder("(");
        if (codeList.size() >= 1) {
            query.append("'" + codeList.get(0).toString() + "'");
            for (int i = 1; i < codeList.size(); i++) {
                query.append("," + "'"  + codeList.get(i) + "'" );
            }
        }
        return query.append(")").toString();
    }

}
