package org.egov.egf.web.controller.microservice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.egov.billsaccounting.services.CreateVoucher;
import org.egov.billsaccounting.services.VoucherConstant;
import org.egov.commons.CVoucherHeader;
import org.egov.egf.contract.model.AccountDetailContract;
import org.egov.egf.contract.model.SubledgerDetailContract;
import org.egov.egf.contract.model.Voucher;
import org.egov.egf.contract.model.VoucherRequest;
import org.egov.egf.contract.model.VoucherResponse;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.model.bills.EgBillPayeedetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController 
public class VoucherController {
	@Autowired
	private CreateVoucher createVoucher;
	@Autowired
	private MicroserviceUtils microserviceUtils;

	
	@PostMapping(value = "/voucher/_create")
	@ResponseBody
	public VoucherResponse create(@RequestBody VoucherRequest voucherRequest) {
	
		VoucherResponse response=new VoucherResponse();
		final HashMap<String, Object> headerDetails = new HashMap<String, Object>();
		HashMap<String, Object> detailMap = null;
		HashMap<String, Object> subledgertDetailMap = null;
		Set<EgBillPayeedetails> subLedgerlist;
		final List<HashMap<String, Object>> accountdetails = new ArrayList<>();
		final List<HashMap<String, Object>> subledgerDetails = new ArrayList<>();
		
		for(Voucher voucher:voucherRequest.getVouchers())
		{
		
		 List<org.egov.infra.microservice.models.Department> list =microserviceUtils.getDepartmentsById(voucher.getDepartment());
		 String departmentCode = list!=null && !list.isEmpty() ? list.get(0).getCode() : "";
		 headerDetails.put(VoucherConstant.DEPARTMENTCODE, departmentCode);
	      
		headerDetails.put(VoucherConstant.VOUCHERNAME, voucher.getName());
		headerDetails.put(VoucherConstant.VOUCHERTYPE, voucher.getType());
		headerDetails.put(VoucherConstant.VOUCHERNUMBER, voucher.getVoucherNumber());
		headerDetails.put(VoucherConstant.VOUCHERDATE, voucher.getVoucherDate());
		if(voucher.getFund()!=null)
		headerDetails.put(VoucherConstant.FUNDCODE, voucher.getFund().getCode()); 
		
		if(voucher.getFunctionary()!=null)
			headerDetails.put(VoucherConstant.FUNCTIONARYCODE, voucher.getFunctionary().getCode()); 
		if(voucher.getScheme()!=null)
			headerDetails.put(VoucherConstant.SCHEMECODE, voucher.getScheme().getCode()); 
		if(voucher.getSubScheme()!=null)
			headerDetails.put(VoucherConstant.SUBSCHEMECODE, voucher.getSubScheme().getCode()); 
		
		
		for(AccountDetailContract ac:voucher.getLedgers())  
		{
			
			detailMap=new HashMap<>();
			detailMap.put(VoucherConstant.GLCODE, ac.getGlcode());
			detailMap.put(VoucherConstant.DEBITAMOUNT, ac.getDebitAmount());
			detailMap.put(VoucherConstant.CREDITAMOUNT, ac.getCreditAmount());
			if(ac.getFunction().getCode()!=null)
				detailMap.put(VoucherConstant.FUNCTIONCODE, ac.getFunction().getCode());
			
			accountdetails.add(detailMap);
			

			for(SubledgerDetailContract sl:ac.getSubledgerDetails())
			{
				
				subledgertDetailMap=new HashMap<>();
				subledgertDetailMap.put(VoucherConstant.GLCODE, ac.getGlcode());
				subledgertDetailMap.put(VoucherConstant.DETAILAMOUNT, sl.getAmount());
				subledgertDetailMap.put(VoucherConstant.DETAIL_TYPE_ID, sl.getAccountDetailType().getId());
				subledgertDetailMap.put(VoucherConstant.DETAIL_KEY_ID, sl.getAccountDetailKey().getId());
				subledgerDetails.add(subledgertDetailMap);
			}
		}
		
		try {
			CVoucherHeader voucherHeader = createVoucher.createVoucher(headerDetails, accountdetails, subledgerDetails);
			voucher.setId(voucherHeader.getId());
			voucher.setVoucherNumber(voucherHeader.getVoucherNumber());
			response.getVouchers().add(voucher);
		} catch (ApplicationRuntimeException e) {
		 
		}
		
		
		}
		return response;
	}
	
}
