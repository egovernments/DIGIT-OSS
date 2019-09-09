package org.egov.demand.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import org.egov.demand.model.AuditDetail;
import org.egov.demand.model.GlCodeMaster;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.enums.Category;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class TaxHeadMasterRowMapper implements ResultSetExtractor<List<TaxHeadMaster>>{

	@Override
	public List<TaxHeadMaster> extractData(ResultSet rs) throws SQLException, DataAccessException {

		Map<String, TaxHeadMaster> taxHeadMap = new LinkedHashMap<>();

		while (rs.next()) {

			try {
				String taxHeadId = rs.getString("taxheadId");
				log.debug("taxHead Master id in row mapper" + taxHeadId);
				TaxHeadMaster taxHead = taxHeadMap.get(taxHeadId);

				if (taxHead == null) {
					taxHead=new TaxHeadMaster();
					taxHead.setId(taxHeadId);
					taxHead.setTenantId(rs.getString("taxheadTenantid"));
					taxHead.setCategory(Category.fromValue(rs.getString("category")));
					taxHead.setService(rs.getString("taxheadService"));
					taxHead.setName(rs.getString("name"));
					taxHead.setCode(rs.getString("code"));
					taxHead.setIsDebit(rs.getBoolean("isdebit"));
					taxHead.setIsActualDemand(rs.getBoolean("isactualdemand"));
					taxHead.setOrder(rs.getInt("orderno"));
					taxHead.setValidFrom(rs.getLong("validfrom"));
					taxHead.setValidTill(rs.getLong("validtill"));
					
					AuditDetail auditDetails=new AuditDetail();
					auditDetails.setCreatedBy(rs.getString("taxcreatedby"));
					auditDetails.setCreatedTime((Long)rs.getObject("taxcreatedtime"));
					auditDetails.setLastModifiedBy(rs.getString("taxlastmodifiedby"));
					auditDetails.setLastModifiedTime((Long)rs.getObject("taxlastmodifiedtime"));
					
					taxHead.setAuditDetail(auditDetails);
					
					taxHead.setGlCodes(new ArrayList<>());
					taxHeadMap.put(taxHead.getId(), taxHead);
				}
				GlCodeMaster glCode=new GlCodeMaster();
				glCode.setId(rs.getString("glCodeId"));
				glCode.setTenantId(rs.getString("glCodeTenantId"));
				glCode.setService(rs.getString("glCodeService"));
				glCode.setTaxHead(rs.getString("taxhead"));
				glCode.setGlCode(rs.getString("glcode"));
				glCode.setFromDate((Long)rs.getObject("fromdate"));
				glCode.setToDate((Long)rs.getObject("todate"));
				
				AuditDetail glauditDetail = new AuditDetail();
				glauditDetail.setCreatedBy(rs.getString("glcreatedby"));
				glauditDetail.setCreatedTime(rs.getLong("glcreatedtime"));
				glauditDetail.setLastModifiedBy(rs.getString("gllastModifiedby"));
				glauditDetail.setLastModifiedTime(rs.getLong("gllastModifiedtime"));
				glCode.setAuditDetails(glauditDetail);
				
				if (taxHead.getCode().equals(glCode.getTaxHead()))
					taxHead.getGlCodes().add(glCode);
			} catch (Exception e) {
				log.debug("exception in taxHeadMasterRowMapper : " + e);
				throw new RuntimeException("error while mapping object from reult set : " + e);
			}
		}
		log.debug("converting map to list object ::: " + taxHeadMap.values());
		return new ArrayList<>(taxHeadMap.values());
	}
}
