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

package org.egov.egf.web.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.egov.commons.Accountdetailtype;
import org.egov.commons.CChartOfAccountDetail;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.CFunction;
import org.egov.commons.dao.ChartOfAccountsDAO;
import org.egov.commons.dao.FinancialYearDAO;
import org.egov.commons.dao.FunctionDAO;
import org.egov.commons.dao.FundHibernateDAO;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.infstr.services.PersistenceService;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.egov.model.contra.TransactionSummary;
import org.egov.model.contra.TransactionSummaryDto;
import org.egov.model.service.TransactionSummaryService;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@SuppressWarnings("deprecation")
@Controller
@RequestMapping("/transactionsummary")
@Validated
public class TransactionSummaryController {

	private static final String TRANSACTION_SUMMARY = "transactionSummary";
	private static final String TRANSACTIONSUMMARY_NEW = "transactionsummary-new";
	private static final String TRANSACTIONSUMMARY_RESULT = "transactionsummary-result";
	private static final String TRANSACTIONSUMMARY_EDIT = "transactionsummary-edit";
	private static final String TRANSACTIONSUMMARY_VIEW = "transactionsummary-view";
	@Autowired
	private TransactionSummaryService transactionSummaryService;
	@Autowired
	private AccountdetailtypeService accountdetailtypeService;
	@Autowired
	private FinancialYearDAO financialYearDAO;
	@Autowired
	private FundHibernateDAO fundHibernateDAO;
	@Autowired
	private ChartOfAccountsDAO chartOfAccountsDAO;

	@Autowired
	private EgovMasterDataCaching masterDataCache;

	@SuppressWarnings("rawtypes")
	@Autowired
	@Qualifier("persistenceService")
	private PersistenceService persistenceService;

	@Autowired
	private FunctionDAO functionDAO;

	private void prepareNewForm(Model model) {
		model.addAttribute("accountdetailtypes", accountdetailtypeService.findAll());
		model.addAttribute("cFinancialYears", financialYearDAO.getAllActivePostingFinancialYear());
		model.addAttribute("funds", fundHibernateDAO.findAllActiveFunds());
		model.addAttribute("cChartOfAccountss", chartOfAccountsDAO.findAll());
		model.addAttribute("departments", masterDataCache.get("egi-department"));
		model.addAttribute("cFunctions", functionDAO.getAllActiveFunctions());
	}

	@PostMapping(value = "/new")
	public String newForm(final Model model) {
		prepareNewForm(model);
		model.addAttribute("transactionSummaryDto", new TransactionSummaryDto());
		return TRANSACTIONSUMMARY_NEW;
	}

	@PostMapping(value = "/create")
	public @ResponseBody ResponseEntity<?> create(@Valid @ModelAttribute final TransactionSummaryDto transactionSummaryDto,
			final BindingResult errors, final Model model, final RedirectAttributes redirectAttrs,
			HttpServletResponse response) {
		List<TransactionSummary> transactionSummaries = new ArrayList<>();
		transactionSummaries = removeEmptyRows(transactionSummaryDto.getTransactionSummaryList());
		try {
			for (TransactionSummary ts : transactionSummaries) {
				TransactionSummary transactionSummary = null;
				if (ts.getId() != null) {
					transactionSummary = transactionSummaryService.findOne(ts.getId());
				} else {
					transactionSummary = new TransactionSummary();
				}
				if (ts.getId() == null && ts.getGlcodeid() == null) {
					// Ignore ts and move to next
				} else if (ts.getId() != null && ts.getGlcodeid() == null) {
					// delete this transaction
					transactionSummaryService.delete(transactionSummary);
				} else {
					transactionSummary.setDepartmentCode(transactionSummaryDto.getDepartmentcode());
					transactionSummary.setDivisionid(transactionSummaryDto.getDivisionid());
					transactionSummary.setFinancialyear(
							financialYearDAO.getFinancialYearById(transactionSummaryDto.getFinancialyear().getId()));

					transactionSummary.setFunctionid((CFunction) persistenceService.find("from CFunction where id=?",
							transactionSummaryDto.getFunctionid().getId()));
					transactionSummary
							.setFund(fundHibernateDAO.fundById(transactionSummaryDto.getFund().getId(), false));

					transactionSummary.setAccountdetailkey(ts.getAccountdetailkey());
					if (ts.getAccountdetailtype() != null && ts.getAccountdetailtype().getId() != null)
						transactionSummary.setAccountdetailtype(
								accountdetailtypeService.findOne(ts.getAccountdetailtype().getId()));
					else
						transactionSummary.setAccountdetailtype(null);

					transactionSummary.setGlcodeid(
							chartOfAccountsDAO.getCChartOfAccountsByGlCode(ts.getGlcodeDetail()));
					transactionSummary.setNarration(ts.getNarration());
					transactionSummary.setOpeningcreditbalance(
							ts.getOpeningcreditbalance() == null ? BigDecimal.ZERO : ts.getOpeningcreditbalance());
					transactionSummary.setOpeningdebitbalance(
							ts.getOpeningdebitbalance() == null ? BigDecimal.ZERO : ts.getOpeningdebitbalance());
					transactionSummaryService.create(transactionSummary);
				}
			}
		} catch (HttpClientErrorException e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	private List<TransactionSummary> removeEmptyRows(List<TransactionSummary> transactionSummaries) {

		List<TransactionSummary> tempTransactionSummaries = new ArrayList<>();
		for (TransactionSummary transactionSummary : transactionSummaries)
			if (transactionSummaries.size() != (tempTransactionSummaries.size() + 1))
				tempTransactionSummaries.add(transactionSummary);

		/**
		 * Checking last row : if glcode is not there then delete row . else
		 * keep the row
		 **/
		if (transactionSummaries.get(transactionSummaries.size() - 1).getGlcodeDetail() != null
				&& !transactionSummaries.get(transactionSummaries.size() - 1).getGlcodeDetail().equals(""))
			tempTransactionSummaries.add(transactionSummaries.get(transactionSummaries.size() - 1));
		return tempTransactionSummaries;
	}

	@GetMapping(value = "/edit/{id}")
	public String edit(@PathVariable("id") final Long id, Model model) {
		TransactionSummary transactionSummary = transactionSummaryService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(TRANSACTION_SUMMARY, transactionSummary);
		return TRANSACTIONSUMMARY_EDIT;
	}

	@PostMapping(value = "/update")
	public String update(@Valid @ModelAttribute final TransactionSummary transactionSummary, final BindingResult errors,
			final Model model, final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return TRANSACTIONSUMMARY_EDIT;
		}
		transactionSummaryService.update(transactionSummary);
		redirectAttrs.addFlashAttribute("message", "msg.transactionSummary.success");
		return "redirect:/transactionsummary/result/" + transactionSummary.getId();
	}

	@GetMapping(value = "/view/{id}")
	public String view(@PathVariable("id") final Long id, Model model) {
		TransactionSummary transactionSummary = transactionSummaryService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(TRANSACTION_SUMMARY, transactionSummary);
		return TRANSACTIONSUMMARY_VIEW;
	}

	@GetMapping(value = "/result/{id}")
	public String result(@PathVariable("id") final Long id, Model model) {
		TransactionSummary transactionSummary = transactionSummaryService.findOne(id);
		model.addAttribute(TRANSACTION_SUMMARY, transactionSummary);
		return TRANSACTIONSUMMARY_RESULT;
	}

	@GetMapping(value = "/ajax/getMajorHeads")
	public @ResponseBody List<CChartOfAccounts> getMajorHeads(@RequestParam("type") Character type) {
		return chartOfAccountsDAO.findByType(type); 
	}

	@GetMapping(value = "/ajax/getMinorHeads")
	public @ResponseBody List<CChartOfAccounts> getMinorHeads(@RequestParam("majorCode") @SafeHtml String majorCode,
			@RequestParam("classification") Long classification) {
		return chartOfAccountsDAO.findByMajorCodeAndClassification(majorCode, classification);
	}

	@GetMapping(value = "/ajax/getAccounts")
	public @ResponseBody List<CChartOfAccounts> getAccounts(@RequestParam("term") @SafeHtml String glcode,
			@RequestParam("majorCode") @SafeHtml String majorCode, @RequestParam("classification") Long classification) {
		List<CChartOfAccounts> accounts = null;
		if (majorCode != null) {
			accounts = chartOfAccountsDAO.findByGlcodeLikeIgnoreCaseAndClassificationAndMajorCode(glcode + "%",
					classification, majorCode);
		} else {
			accounts = chartOfAccountsDAO.findByGlcodeLikeIgnoreCaseAndClassification(glcode + "%", classification);
		}

		return accounts;
	}

	@GetMapping(value = "/ajax/getAccountDetailTypes")
	public @ResponseBody List<Accountdetailtype> getAccountDetailTypes(@RequestParam("id") Long id) {
		CChartOfAccounts account = chartOfAccountsDAO.findById(id.intValue(), false);
		List<Accountdetailtype> detailTypes = new ArrayList<>();
		for (CChartOfAccountDetail detail : account.getChartOfAccountDetails()) {
			detailTypes.add(detail.getDetailTypeId());
		}
		return detailTypes;
	}

	@GetMapping(value = "/ajax/searchTransactionSummariesForNonSubledger")
	public @ResponseBody List<Map<String, String>> searchTransactionSummariesForNonSubledger(
			@RequestParam("finYear") Long finYear, @RequestParam("fund") Long fund, @RequestParam("functn") Long functn,
			@RequestParam("department") @SafeHtml String department, @RequestParam("glcodeId") Long glcodeId) {
		List<Map<String, String>> result = new ArrayList<>();
		Map<String, String> amountsMap = new HashMap<>();

		List<TransactionSummary> transactionSummaries = transactionSummaryService
				.searchTransactionsForNonSubledger(finYear, fund, functn, department, glcodeId);
		for (TransactionSummary ts : transactionSummaries) {
			amountsMap.put("tsid", ts.getId().toString());
			amountsMap.put("openingdebitbalance",
					ts.getOpeningdebitbalance().setScale(2, BigDecimal.ROUND_HALF_EVEN).toString());
			amountsMap.put("openingcreditbalance",
					ts.getOpeningcreditbalance().setScale(2, BigDecimal.ROUND_HALF_EVEN).toString());
			amountsMap.put("narration", ts.getNarration());
			result.add(amountsMap);

		}

		return result;
	}

	@GetMapping(value = "/ajax/searchTransactionSummariesForSubledger")
	public @ResponseBody List<Map<String, String>> searchTransactionSummariesForSubledger(
			@RequestParam("finYear") Long finYear, @RequestParam("fund") Long fund, @RequestParam("functn") Long functn,
			@RequestParam("department") @SafeHtml String department, @RequestParam("glcodeId") Long glcodeId,
			@RequestParam("accountDetailTypeId") Integer accountDetailTypeId,
			@RequestParam("accountDetailKeyId") Integer accountDetailKeyId) {
		List<Map<String, String>> result = new ArrayList<>();
		Map<String, String> amountsMap = new HashMap<>();

		List<TransactionSummary> transactionSummaries = transactionSummaryService.searchTransactionsForSubledger(
				finYear, fund, functn, department, glcodeId, accountDetailTypeId, accountDetailKeyId);
		for (TransactionSummary ts : transactionSummaries) {
			amountsMap.put("tsid", ts.getId().toString());
			amountsMap.put("openingdebitbalance",
					ts.getOpeningdebitbalance().setScale(2, BigDecimal.ROUND_HALF_EVEN).toString());
			amountsMap.put("openingcreditbalance",
					ts.getOpeningcreditbalance().setScale(2, BigDecimal.ROUND_HALF_EVEN).toString());
			amountsMap.put("narration", ts.getNarration());
			result.add(amountsMap);

		}

		return result;
	}

	@GetMapping (value = "/ajax/deleteTransaction")
	public @ResponseBody String deleteTransaction(@RequestParam("id") Long id) {

		if (id != null) {
			TransactionSummary ts = transactionSummaryService.findOne(id);
			transactionSummaryService.delete(ts);
		}

		return "success";
	}

	@GetMapping(value = "/ajax/getTransactionSummary")
	public @ResponseBody TransactionSummary getTransactionSummary(@RequestParam("glcodeid") Long glcodeId,
			@RequestParam("accountdetailtypeid") Long accountDetailTypeId,
			@RequestParam("accountdetailkey") Integer accountDetailKey) {
		TransactionSummary ts = null;
		if (glcodeId != null && accountDetailTypeId != null && accountDetailKey != null) {
			ts = transactionSummaryService.getTransactionSummary(glcodeId, accountDetailTypeId, accountDetailKey);
		}
		return ts;
	}
}
