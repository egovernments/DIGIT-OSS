/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any Long of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.mdms.service;

import java.util.List;

import org.egov.receipt.consumer.model.BusinessService;
import org.egov.receipt.consumer.model.FinanceMdmsModel;
import org.egov.receipt.consumer.model.FinancialStatus;
import org.egov.receipt.consumer.model.InstrumentContract;
import org.egov.receipt.consumer.model.InstrumentSearchContract;
import org.egov.receipt.consumer.model.RequestInfo;
import org.egov.receipt.consumer.model.TaxHeadMaster;
import org.egov.receipt.consumer.model.Tenant;
import org.egov.receipt.custom.exception.VoucherCustomException;
import org.egov.tracer.model.CustomException;

public interface MicroServiceUtil {
	public List<TaxHeadMaster> getTaxHeadMasters(String tenantId, String code, RequestInfo requestInfo, FinanceMdmsModel finSerMdms) throws CustomException, VoucherCustomException;
	public List<BusinessService> getBusinessService(String tenantId, String code, RequestInfo requestInfo, FinanceMdmsModel finSerMdms)  throws CustomException, VoucherCustomException;
	String getBusinessServiceName(String tenantId, String code, RequestInfo requestInfo, FinanceMdmsModel finSerMdms)
			throws VoucherCustomException;
	String getGlcodeByInstrumentType(String tenantId, String businessCode, RequestInfo requestInfo,
			FinanceMdmsModel finSerMdms, String instrumentType) throws VoucherCustomException;
	FinancialStatus getFinancialStatusByCode(String tenantId, RequestInfo requestInfo, FinanceMdmsModel finSerMdms,
			String statusCode) throws VoucherCustomException;
	List<Tenant> getFinanceTenantList(String tenantId, String businessCode, RequestInfo requestInfo, FinanceMdmsModel finSerMdms)
			throws VoucherCustomException;
	List<InstrumentContract> getInstruments(InstrumentSearchContract instrumentSearchContract, RequestInfo requestInfo,
			String tenantId) throws VoucherCustomException;
}
