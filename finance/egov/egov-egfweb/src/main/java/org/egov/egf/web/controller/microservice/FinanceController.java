package org.egov.egf.web.controller.microservice;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.commons.Bank;
import org.egov.commons.Bankbranch;
import org.egov.commons.CFinancialYear;
import org.egov.commons.CFunction;
import org.egov.commons.Fund;
import org.egov.commons.service.BankAccountService;
import org.egov.commons.service.BankBranchService;
import org.egov.commons.service.FinancialYearService;
import org.egov.commons.service.FunctionService;
import org.egov.commons.service.FundService;
import org.egov.egf.contract.model.AuditDetails;
import org.egov.egf.contract.model.BankAccount;
import org.egov.egf.contract.model.BankAccountRequest;
import org.egov.egf.contract.model.BankAccountResponse;
import org.egov.egf.contract.model.BankBranch;
import org.egov.egf.contract.model.BankBranchRequest;
import org.egov.egf.contract.model.BankBranchResponse;
import org.egov.egf.contract.model.BankRequest;
import org.egov.egf.contract.model.BankResponse;
import org.egov.egf.contract.model.FinancialYear;
import org.egov.egf.contract.model.FinancialYearRequest;
import org.egov.egf.contract.model.FinancialYearResponse;
import org.egov.egf.contract.model.Function;
import org.egov.egf.contract.model.FunctionRequest;
import org.egov.egf.contract.model.FunctionResponse;
import org.egov.egf.contract.model.FundRequest;
import org.egov.egf.contract.model.FundResponse;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
import org.egov.infra.microservice.contract.ResponseInfo;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.services.masters.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class FinanceController {

	@Autowired
	private FunctionService functionService;
	@Autowired
	private FundService fundService;
	@Autowired
	private FinancialYearService fyService;
	@Autowired
	private BankService bankService;
	@Autowired
	private BankBranchService branchService;
	@Autowired
	private BankAccountService bankaccountService;

	@PostMapping(value = "/funds/_search")
	@ResponseBody
	public FundResponse fundSearch(@RequestBody @Valid FundRequest fundRequest) {
		Fund fund = new Fund();

		fund.setCode(fundRequest.getCode());
		fund.setName(fundRequest.getName());
		fund.setIsactive(fundRequest.getActive());

		List<Fund> funds = fundService.search(fund, fundRequest.getIds(), fundRequest.getSortBy(),
				fundRequest.getOffset(), fundRequest.getPageSize());

		return getSuccessFundResponse(funds, fundRequest);
	}

	@PostMapping(value = "/functions/_search")
	@ResponseBody
	public FunctionResponse functionSearch(@RequestBody @Valid FunctionRequest funcRequest) {
		CFunction function = new CFunction();
		function.setCode(funcRequest.getCode());
		function.setName(funcRequest.getName());
		function.setIsActive(funcRequest.getActive());

		List<CFunction> functions = functionService.search(function, funcRequest.getIds(), funcRequest.getSortBy(),
				funcRequest.getOffset(), funcRequest.getPageSize());

		return getSuccessFunctionResponse(functions, funcRequest);
	}

	@PostMapping(value = "/COA")
	public void coaSearch() {
		throw new UnsupportedOperationException();
	}

	@PostMapping(value = "/financialyears/_search")
	@ResponseBody
	public FinancialYearResponse financialYearSearch(@RequestBody @Valid FinancialYearRequest fyRequest) {

		CFinancialYear finYear = new CFinancialYear();
		finYear.setFinYearRange(fyRequest.getFinYearRange());
		finYear.setStartingDate(fyRequest.getStartingDate());
		finYear.setEndingDate(fyRequest.getEndingDate());
		finYear.setIsActive(fyRequest.isActive());
		finYear.setIsActiveForPosting(fyRequest.isActiveForPosting());
		List<CFinancialYear> fyList = fyService.Search(finYear, fyRequest.getIds(), fyRequest.getSortBy(),
				fyRequest.getPageSize(), fyRequest.getOffset());

		return getSuccessFYResponse(fyList, fyRequest);
	}

	@PostMapping(value = "/bank")
	@ResponseBody
	public BankResponse bankSearch(@ModelAttribute @Valid BankRequest bankRequest,
			BindingResult modelAttributeBindingResult, @RequestBody @Valid RequestInfoWrapper request,
			BindingResult requestBodyBindingResult) {
		return null;
	}

	@PostMapping(value="/rest/bank/all")
	@ResponseBody
	public BankResponse getAllBanks(@ModelAttribute @Valid BankRequest bankRequest,BindingResult modelAttributeBindingResult
	              ,@RequestBody @Valid RequestInfoWrapper request,BindingResult requestBodyBindingResult) {
	    setSchema(bankRequest.getTenantId());
	    List<Bank> banks = bankService.getAllBanks();
	    return getSuccessBankResponse(banks, bankRequest,request.getRequestInfo());
	}
	@PostMapping(value = "/bankbranch")
	@ResponseBody
	public BankBranchResponse bankBranchSearch(@RequestBody @Valid BankBranchRequest bbRequest) {

		Bankbranch branch = new Bankbranch();
		branch.setBranchcode(bbRequest.getCode());
		branch.setBranchname(bbRequest.getName());
		branch.setIsactive(bbRequest.getActive());
		List<Bankbranch> branchList = branchService.search(branch, bbRequest.getIds(), bbRequest.getBank(),
				bbRequest.getSortBy(), bbRequest.getOffset(), bbRequest.getPageSize());

		return getSuccessBankBranchResponse(branchList, bbRequest);
	}

	@PostMapping(value = "/rest/bankaccount")
	@ResponseBody
	public BankAccountResponse bankAccountSearch(@ModelAttribute @Valid BankAccountRequest bankaccountrequest,
			BindingResult modelAttributeBindingResult, @RequestBody @Valid RequestInfoWrapper request,
			BindingResult requestBodyBindingResult) {
		setSchema(bankaccountrequest.getTenantId());
		Map<String, String> accounts = bankaccountService.getAllBankAccounts();

		return getSuccessBankAccountResponse(request.getRequestInfo(), accounts);
	}
	
	@PostMapping(value= "/rest/test")
	@ResponseBody
	public  String testme(@ModelAttribute @Valid BankRequest bankRequest,BindingResult modelAttributeBindingResult
	        ,@RequestBody @Valid RequestInfoWrapper request,BindingResult requestBodyBindingResult){
	    return "success";
	}
	
	@PostMapping(value = "/recovery")
	public void recoverySearch() {
		throw new UnsupportedOperationException();
	}

	private ResponseInfo createResponseObj(RequestInfo requestinfo, boolean success) {
		ResponseInfo response = new ResponseInfo();
		response.setApiId(requestinfo.getApiId());
		response.setMsgId(requestinfo.getMsgId());
		response.setResMsgId(requestinfo.getMsgId());

		String responseStatus = success ? "successful" : "failed";
		response.setStatus(responseStatus);
		response.setVer(requestinfo.getVer());
		if (requestinfo.getTs() != null)
			response.setTs(requestinfo.getTs().toString());

		return response;
	}

	private FundResponse getSuccessFundResponse(List<Fund> funds, FundRequest fundRequest) {

		ResponseInfo responseInfo = createResponseObj(fundRequest.getRequestInfo(), true);

		List<org.egov.egf.contract.model.Fund> fundlist = new ArrayList<>();

		funds.forEach(fund -> {

			AuditDetails auditDetails = new AuditDetails(fundRequest.getTenantId(),
					fund.getCreatedby() != null ? fund.getCreatedby() : null,
					fund.getLastModifiedBy() != null ? fund.getLastModifiedBy() : null, fund.getCreatedDate(),
					fund.getLastModifiedDate());
			org.egov.egf.contract.model.Fund fundContractract = new org.egov.egf.contract.model.Fund();
			fundContractract.setAuditDetils(auditDetails);
			fundContractract.setActive(fund.getIsactive());
			fundContractract.setCode(fund.getCode());
			fundContractract.setId(fund.getId());
			fundContractract.setIdentifier(fund.getIdentifier());
			fundContractract.setIsParent(fund.getIsnotleaf());
			fundContractract.setLevel(String.valueOf(fund.getLlevel()));
			fundContractract.setName(fund.getName());
			if (fund.getParentId() != null)
				fundContractract.setParent(fund.getParentId().getId());

			fundlist.add(fundContractract);
		});

		Pagination page = new Pagination();
		page.setOffSet(fundRequest.getOffset());
		page.setPageSize(fundRequest.getPageSize());
		page.setTotalResults(fundlist.size());

		return new FundResponse(responseInfo, fundlist, page);
	}

	private FunctionResponse getSuccessFunctionResponse(List<CFunction> functions, FunctionRequest funRequest) {

		ResponseInfo responseInfo = createResponseObj(funRequest.getRequestInfo(), true);
		List<Function> funList = new ArrayList<>();
		functions.forEach(function -> {
			AuditDetails auditDetails = new AuditDetails(funRequest.getTenantId(), function.getCreatedBy(),
					function.getLastModifiedBy(), function.getCreatedDate(), function.getLastModifiedDate());
			// Long id, String name, String code, Integer level, Boolean active,
			// Long parentId, AuditDetails auditDetails)
			Function func = new Function(function.getId(), function.getName(), function.getCode(), function.getLlevel(),
					function.getIsActive(), function.getParentId() != null ? function.getParentId().getId() : 0,
					auditDetails);

			funList.add(func);
		});
		Pagination page = new Pagination();
		page.setOffSet(funRequest.getOffset());
		page.setPageSize(funRequest.getPageSize());
		page.setTotalResults(funList.size());

		return new FunctionResponse(responseInfo, funList, page);
	}

	private FinancialYearResponse getSuccessFYResponse(List<CFinancialYear> financeyears,
			FinancialYearRequest fyRequest) {

		ResponseInfo responseInfo = createResponseObj(fyRequest.getRequestInfo(), true);

		List<FinancialYear> fyList = new ArrayList<>();
		financeyears.forEach(fYear -> {

			AuditDetails auditDetails = new AuditDetails(fyRequest.getTeanantId(), fYear.getCreatedBy(),
					fYear.getLastModifiedBy(), fYear.getCreatedDate(), fYear.getLastModifiedDate());
			FinancialYear fy = new FinancialYear(fYear.getId(), fYear.getFinYearRange(), fYear.getStartingDate(),
					fYear.getEndingDate(), fYear.getIsActive(), fYear.getIsActiveForPosting(), fYear.getIsClosed(),
					fYear.getTransferClosingBalance(), auditDetails);
			fyList.add(fy);
		});

		Pagination page = new Pagination();
		page.setOffSet(fyRequest.getOffset());
		page.setPageSize(fyRequest.getPageSize());
		page.setTotalResults(fyList.size());

		return new FinancialYearResponse(responseInfo, fyList, page);

	}

	private BankResponse getSuccessBankResponse(List<Bank> banks, BankRequest bankRequest,RequestInfo requestInfo) {

		ResponseInfo responseInfo = createResponseObj(requestInfo, true);

		List<org.egov.egf.contract.model.Bank> bankList = new ArrayList<>();
		banks.forEach(bank -> {
			AuditDetails auditDetails = new AuditDetails(bankRequest.getTenantId(), bank.getCreatedBy(),
					bank.getLastModifiedBy(), bank.getCreatedDate(), bank.getLastModifiedDate());

			org.egov.egf.contract.model.Bank bankContract = new org.egov.egf.contract.model.Bank(bank.getId(), bank.getCode(),
					bank.getName(), bank.getNarration(), bank.getIsactive(), bank.getType(), auditDetails);
			bankList.add(bankContract);
		});

		Pagination page = new Pagination();
		page.setOffSet(bankRequest.getOffset());
		page.setPageSize(bankRequest.getPageSize());
		page.setTotalResults(bankList.size());

		return new BankResponse(responseInfo, bankList, page);
	}

	private BankBranchResponse getSuccessBankBranchResponse(List<Bankbranch> branches,
			BankBranchRequest branchRequest) {

		ResponseInfo responseInfo = createResponseObj(branchRequest.getRequestInfo(), true);

		List<BankBranch> branchList = new ArrayList<>();

		branches.forEach(branch -> {
			AuditDetails branchAudit = new AuditDetails(branchRequest.getTenantId(),
					branch.getCreatedBy() != null ? branch.getCreatedBy() : null,
					branch.getLastModifiedBy() != null ? branch.getLastModifiedBy() : null, branch.getCreatedDate(),
					branch.getLastModifiedDate());
			BankBranch bankBranch = new BankBranch();

			bankBranch.setActive(branch.getIsactive());
			bankBranch.setAddress(branch.getBranchaddress1());
			bankBranch.setAddress2(branch.getBranchaddress2());
			bankBranch.setAuditDetails(branchAudit);

			if (branch.getBank() != null) {
				AuditDetails bankAudit = new AuditDetails(branchRequest.getTenantId(),
						branch.getBank().getCreatedBy() != null ? branch.getBank().getCreatedBy() : null,
						branch.getBank().getLastModifiedBy() != null ? branch.getBank().getLastModifiedBy() : null,
						branch.getBank().getCreatedDate(), branch.getBank().getLastModifiedDate());
				org.egov.egf.contract.model.Bank bankContract = new org.egov.egf.contract.model.Bank();
				bankContract.setCode(branch.getBank().getCode());
				bankContract.setId(branch.getBank().getId());
				bankContract.setName(branch.getBank().getName());
				bankContract.setActive(branch.getBank().getIsactive());
				bankContract.setType(branch.getBank().getType());
				bankContract.setDescription(branch.getBank().getNarration());
				bankContract.setAuditDetails(bankAudit);
				bankBranch.setBank(bankContract);
			}

			bankBranch.setCity(branch.getBranchcity());
			bankBranch.setCode(branch.getBranchcode());
			bankBranch.setContactPerson(branch.getContactperson());
			bankBranch.setDescription(branch.getNarration());
			bankBranch.setFax(branch.getBranchfax());
			bankBranch.setId(branch.getId().longValue());
			bankBranch.setMicr(branch.getBranchMICR());
			bankBranch.setName(branch.getBranchname());
			bankBranch.setPhone(branch.getBranchphone());
			bankBranch.setPincode(branch.getBranchpin());
			bankBranch.setState(branch.getBranchstate());

			branchList.add(bankBranch);
		});

		Pagination page = new Pagination();
		page.setOffSet(branchRequest.getOffset());
		page.setPageSize(branchRequest.getPageSize());
		page.setTotalResults(branchList.size());

		return new BankBranchResponse(responseInfo, branchList, page);
	}

	private BankAccountResponse getSuccessBankAccountResponse(RequestInfo requestInfo,Map<String,String> accounts){
	 
	    ResponseInfo responseInfo = createResponseObj(requestInfo, true);
	    List<BankAccount> accountlist = new ArrayList<>();
	    accounts.forEach((key,value)->
	        accountlist.add(new BankAccount(key,value))
	     );
	    
	    return new BankAccountResponse(responseInfo, accountlist, new Pagination());
	}
	
	private void setSchema(String tenantid) {
		if (null != tenantid && !"".equals(tenantid)) {
			String[] tenantParts = tenantid.split("\\.");
			if (tenantParts == null || tenantParts.length < 2) {
				throw new ApplicationRuntimeException("tenantid not formed properly");
			}
			ApplicationThreadLocals.setTenantID(tenantParts[1]);
		} else
			throw new ApplicationRuntimeException("tenantid not formed properly");
	}
}
