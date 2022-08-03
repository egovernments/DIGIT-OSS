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
package org.egov.receipt.consumer.service;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Set;

import org.egov.receipt.consumer.model.FinanceMdmsModel;
import org.egov.receipt.consumer.model.InstrumentContract;
import org.egov.receipt.consumer.model.Receipt;
import org.egov.receipt.consumer.model.ReceiptReq;
import org.egov.receipt.consumer.model.RequestInfo;
import org.egov.receipt.consumer.model.Voucher;
import org.egov.receipt.consumer.model.VoucherResponse;
import org.egov.receipt.consumer.model.VoucherSearchCriteria;
import org.egov.receipt.custom.exception.VoucherCustomException;
import org.egov.tracer.model.CustomException;

public interface VoucherService {
	public VoucherResponse createReceiptVoucher(ReceiptReq req, FinanceMdmsModel finSerMdms, String collectionVersion) throws CustomException;
	public VoucherResponse cancelReceiptVoucher(ReceiptReq req,  String tenantId, Set<String> voucherNumbers) throws CustomException, VoucherCustomException;
	public boolean isVoucherCreationEnabled(Receipt receipt, RequestInfo req, FinanceMdmsModel finSerMdms) throws CustomException;
	public boolean isTenantEnabledInFinanceModule(ReceiptReq req, FinanceMdmsModel finSerMdms) throws VoucherCustomException;
	VoucherResponse getVoucherByServiceAndRefDoc(RequestInfo requestInfo, String tenantId, String serviceCode,
			String referenceDoc) throws VoucherCustomException, UnsupportedEncodingException;
	VoucherResponse getVouchers(VoucherSearchCriteria criteria, RequestInfo requestInfo, String tenantId)
			throws VoucherCustomException;
	VoucherResponse createVoucher(List<Voucher> vouchers, RequestInfo requestInfo, String tenantId)
			throws VoucherCustomException;
	VoucherResponse processReversalVoucher(List<InstrumentContract> instruments, RequestInfo requestInfo);
}
