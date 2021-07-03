/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
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
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */
package org.egov.egf.web.controller.report;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Size;

import org.egov.commons.dao.FinancialYearDAO;
import org.egov.egf.web.service.report.RemittanceServiceImpl;
import org.egov.infra.microservice.models.BankAccountServiceMapping;
import org.egov.infra.microservice.models.EmployeeSearchCriteria;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infstr.services.PersistenceService;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.egov.model.remittance.RemittanceReportModel;
import org.hibernate.validator.constraints.SafeHtml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;

@SuppressWarnings("deprecation")
@Controller
@RequestMapping("/report/remittance")
@Validated
public class RemittanceReportController {

	private static final String MANDATORY = "mandatory";
	@Autowired
	protected EgovMasterDataCaching masterDataCache;
	@Autowired
	public MicroserviceUtils microserviceUtils;
	@Autowired
	private FinancialYearDAO financialYearDAO;
	@SuppressWarnings("rawtypes")
	@Autowired
	@Qualifier("persistenceService")
	protected PersistenceService persistenceService;
	@Autowired
	private RemittanceServiceImpl remittanceService;

	@Value("${collection.remittance.roles:COLL_REMIT_TO_BANK,SUPERUSER,COLL_RECEIPT_CREATOR}")
	private String rolesToRemit;
	@Value("${billing.service.type:Finance}")
	private String serviceType;
	private static final Logger LOGGER = LoggerFactory.getLogger(RemittanceReportController.class);

	@RequestMapping(method = { RequestMethod.POST, RequestMethod.GET }, value = "/collection/form")
	public String getRemittanceReportForm(final Model model) {
		prepareModel(model);
		return "remittance_collection_search";
	}

	@RequestMapping(method = { RequestMethod.POST, RequestMethod.GET }, value = "/pending/form")
	public String getRemittancePendingReportForm(final Model model) {
		preparePendingModel(model);
		return "remittance_pending_search";
	}

	@SuppressWarnings("rawtypes")
	@GetMapping("/collection/_search")
	public @ResponseBody ResponseEntity getRemittanceSearch(
			@Valid @ModelAttribute RemittanceReportModel remittanceReportModel, final BindingResult errors) {
		try {
			validateRemittanceSearch(remittanceReportModel, errors);
			if (errors.hasErrors()) {
				LOGGER.error(errors.getAllErrors().toString());
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			return new ResponseEntity<>(getRemittenceCollections(remittanceReportModel), HttpStatus.OK);
		} catch (HttpClientErrorException e) {
			LOGGER.error(e.getMessage());
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	private void validateRemittanceSearch(RemittanceReportModel remittanceReportModel, BindingResult errors) {
		if (StringUtils.isEmpty(remittanceReportModel.getBankAccount())
				|| "0".equals(remittanceReportModel.getBankAccount())) {
			errors.rejectValue("bankAccount", MANDATORY);
		}
		if (remittanceReportModel.getFinancialYear() == null || remittanceReportModel.getFinancialYear() == 0) {
			errors.rejectValue("financialYear", MANDATORY);
		}
		if (StringUtils.isEmpty(remittanceReportModel.getInstrumentType())
				|| "0".equals(remittanceReportModel.getInstrumentType())) {
			errors.rejectValue("instrumentType", MANDATORY);
		}
	}

	@SuppressWarnings("rawtypes")
	@GetMapping("/pending/_search")
	public @ResponseBody ResponseEntity getRemittancePendingSearch(
			@Valid @ModelAttribute RemittanceReportModel remittanceReportModel, final BindingResult errors) {
		try {
			validateRemittancePendingSearch(remittanceReportModel, errors);
			if (errors.hasErrors()) {
				LOGGER.error(errors.getAllErrors().toString());
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			return new ResponseEntity<>(remittanceService.getPendingRemittance(remittanceReportModel), HttpStatus.OK);
		} catch (HttpClientErrorException e) {
			LOGGER.error(e.getMessage());
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	private void validateRemittancePendingSearch(RemittanceReportModel remittanceReportModel, BindingResult errors) {
		if (StringUtils.isEmpty(remittanceReportModel.getFromDate())) {
			errors.rejectValue("fromDate", MANDATORY);
		}
		if (StringUtils.isEmpty(remittanceReportModel.getToDate())) {
			errors.rejectValue("toDate", MANDATORY);
		}
	}

	@SuppressWarnings("rawtypes")
	@GetMapping(value = "/service/{accountNumber}")
	public @ResponseBody ResponseEntity getServiceByAccountNumber(
			@PathVariable(name = "accountNumber", required = true) @SafeHtml String accountNumber) {
		try {
			List<BankAccountServiceMapping> bankAcntServiceMappings = microserviceUtils
					.getBankAcntServiceMappings(accountNumber, null);
			return new ResponseEntity<>(bankAcntServiceMappings, HttpStatus.OK);
		} catch (HttpClientErrorException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	private List<RemittanceReportModel> getRemittenceCollections(RemittanceReportModel model) {
		return remittanceService.getRemittanceColectionsReports(model);
	}

	private void prepareModel(Model model) {
		model.addAttribute("remittanceReportModel", new RemittanceReportModel());
		model.addAttribute("fundList", masterDataCache.get("egi-fund"));
		model.addAttribute("bankAccServiceMapp", getBankAccountServiceMapping());
		model.addAttribute("financialYearList", financialYearDAO.getAllActivePostingAndNotClosedFinancialYears());
		model.addAttribute("instrumentTypes", getInstrumentMap());
		model.addAttribute("businessServices",
				microserviceUtils.getBusinessServices(Arrays.asList(serviceType.split(","))));
	}

	private void preparePendingModel(Model model) {
		model.addAttribute("remittanceReportModel", new RemittanceReportModel());
		model.addAttribute("instrumentTypes", getInstrumentMap());
		model.addAttribute("businessServices",
				microserviceUtils.getBusinessServices(Arrays.asList(serviceType.split(","))));
		model.addAttribute("userList", microserviceUtils.getEmployeeBySearchCriteria(
				EmployeeSearchCriteria.builder().roles(Arrays.asList(rolesToRemit.split(","))).build()));
	}

	private Object getBankAccountServiceMapping() {
		List<BankAccountServiceMapping> serviceMappings = microserviceUtils.getBankAcntServiceMappings();
		return serviceMappings.stream().collect(Collectors.toMap(BankAccountServiceMapping::getBankAccount,
				Function.identity(), (oldValue, newValue) -> oldValue));
	}

	private Map<String, String> getInstrumentMap() {
		Map<String, String> hashMap = new HashMap<>();
		hashMap.put("Cash", "CASH");
		hashMap.put("Cheque", "CHEQUE");
		return hashMap;
	}
}
