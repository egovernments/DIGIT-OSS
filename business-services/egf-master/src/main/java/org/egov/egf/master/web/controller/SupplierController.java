package org.egov.egf.master.web.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.web.contract.PaginationContract;
import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.egf.master.domain.model.Supplier;
import org.egov.egf.master.domain.model.SupplierSearch;
import org.egov.egf.master.domain.service.SupplierService;
import org.egov.egf.master.web.contract.SupplierContract;
import org.egov.egf.master.web.contract.SupplierSearchContract;
import org.egov.egf.master.web.requests.SupplierRequest;
import org.egov.egf.master.web.requests.SupplierResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

	@Autowired
	private SupplierService supplierService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public SupplierResponse create(@RequestBody SupplierRequest supplierRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		SupplierResponse supplierResponse = new SupplierResponse();
		supplierResponse.setResponseInfo(getResponseInfo(supplierRequest.getRequestInfo()));
		List<Supplier> suppliers = new ArrayList<>();
		Supplier supplier;
		List<SupplierContract> supplierContracts = new ArrayList<>();
		SupplierContract contract;

		supplierRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (SupplierContract supplierContract : supplierRequest.getSuppliers()) {
			supplier = new Supplier();
			model.map(supplierContract, supplier);
			supplier.setCreatedDate(new Date());
			supplier.setCreatedBy(supplierRequest.getRequestInfo().getUserInfo());
			supplier.setLastModifiedBy(supplierRequest.getRequestInfo().getUserInfo());
			suppliers.add(supplier);
		}

		suppliers = supplierService.add(suppliers, errors);

		for (Supplier f : suppliers) {
			contract = new SupplierContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			supplierContracts.add(contract);
		}

		supplierRequest.setSuppliers(supplierContracts);
		supplierService.addToQue(supplierRequest);
		supplierResponse.setSuppliers(supplierContracts);

		return supplierResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public SupplierResponse update(@RequestBody SupplierRequest supplierRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		supplierRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		SupplierResponse supplierResponse = new SupplierResponse();
		List<Supplier> suppliers = new ArrayList<>();
		supplierResponse.setResponseInfo(getResponseInfo(supplierRequest.getRequestInfo()));
		Supplier supplier;
		SupplierContract contract;
		List<SupplierContract> supplierContracts = new ArrayList<>();

		for (SupplierContract supplierContract : supplierRequest.getSuppliers()) {
			supplier = new Supplier();
			model.map(supplierContract, supplier);
			supplier.setLastModifiedBy(supplierRequest.getRequestInfo().getUserInfo());
			supplier.setLastModifiedDate(new Date());
			suppliers.add(supplier);
		}

		suppliers = supplierService.update(suppliers, errors);

		for (Supplier supplierObj : suppliers) {
			contract = new SupplierContract();
			model.map(supplierObj, contract);
			supplierObj.setLastModifiedDate(new Date());
			supplierContracts.add(contract);
		}

		supplierRequest.setSuppliers(supplierContracts);
		supplierService.addToQue(supplierRequest);
		supplierResponse.setSuppliers(supplierContracts);

		return supplierResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public SupplierResponse search(@ModelAttribute SupplierSearchContract supplierSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		SupplierSearch domain = new SupplierSearch();
		mapper.map(supplierSearchContract, domain);
		SupplierContract contract;
		ModelMapper model = new ModelMapper();
		List<SupplierContract> supplierContracts = new ArrayList<>();
		Pagination<Supplier> suppliers = supplierService.search(domain, errors);

		for (Supplier supplier : suppliers.getPagedData()) {
			contract = new SupplierContract();
			model.map(supplier, contract);
			supplierContracts.add(contract);
		}

		SupplierResponse response = new SupplierResponse();
		response.setSuppliers(supplierContracts);
		response.setPage(new PaginationContract(suppliers));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}