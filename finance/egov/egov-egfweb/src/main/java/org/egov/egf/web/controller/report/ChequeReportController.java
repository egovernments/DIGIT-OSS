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

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.egov.model.cheque.ChequeReportJsonAdaptor;
import org.egov.model.cheque.ChequeReportModel;
import org.egov.services.instrument.InstrumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@SuppressWarnings("deprecation")
@Controller
@RequestMapping("/report/cheque")
public class ChequeReportController {

	@Autowired
	protected EgovMasterDataCaching masterDataCache;

	@Autowired
	@Qualifier("instrumentService")
	private InstrumentService instrumentService;

	@Autowired
	private AppConfigValueService appConfigValuesService;

	@RequestMapping(method = { RequestMethod.POST, RequestMethod.GET }, value = "/surrendered/form")
	public String getSurrenderChequeForm(final Model model) {
		prepareModel(model);
		return "surrendered_cheque";
	}

	@GetMapping("/bankBranch/_search")
	public @ResponseBody Map<String, String> searchBankBranch(@RequestParam("fundId") int fundId) {
		return getBankBranch(fundId);
	}

	@GetMapping("/bankAccount/_search")
	public @ResponseBody Map<String, String> searchBankAccount(
			@RequestParam(name = "fundId", required = false) int fundId, @RequestParam("branchId") int branchId) {
		return getBankAccount(fundId, branchId);
	}

	@GetMapping(value = "/surredered/_search", produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String search(@Valid @ModelAttribute ChequeReportModel model) {
		return new StringBuilder("{ \"data\":").append(toSearchResultJson(getSurrenderedCheque(model))).append("}")
				.toString();
	}

	private List<ChequeReportModel> getSurrenderedCheque(ChequeReportModel model) {
		return instrumentService.getSurrenderedCheque(model);
	}

	private void prepareModel(Model model) {
		model.addAttribute("chequeReportModel", new ChequeReportModel());
		model.addAttribute("fundList", masterDataCache.get("egi-fund"));
		model.addAttribute("bankBranchList", getBankBranch(0));
		model.addAttribute("surrendarReasonMap", loadReasonsForSurrendaring());
	}

	private Map<String, String> getBankBranch(int fundId) {
		Map<String, String> bankBranchMap = new HashMap<>();
		List<Object[]> bankBranchByFundId = instrumentService.getBankBranchByFundId(fundId);
		if (!bankBranchByFundId.isEmpty()) {
			for (Object[] obj : bankBranchByFundId) {
				bankBranchMap.put(obj[0].toString(), obj[1].toString());
			}
		}
		return bankBranchMap;
	}

	private Map<String, String> getBankAccount(int fundId, int branchId) {
		Map<String, String> bankAccountMap = new HashMap<>();
		List<Object[]> bankAccount = instrumentService.getBankAccount(fundId, branchId);
		if (!bankAccount.isEmpty()) {
			for (Object[] obj : bankAccount) {
				bankAccountMap.put(obj[0].toString(), obj[2].toString() + "--" + obj[3].toString());
			}
		}
		return bankAccountMap;
	}

	public Map<String, String> loadReasonsForSurrendaring() {
		List<AppConfigValues> appConfigValuesList;
		LinkedHashMap<String, String> surrendarReasonMap = new LinkedHashMap<>();
		appConfigValuesList = appConfigValuesService.getConfigValuesByModuleAndKey("EGF",
				"Reason For Cheque Surrendaring");
		for (final AppConfigValues app : appConfigValuesList) {
			final String value = app.getValue();
			if (app.getValue().indexOf('|') != -1)
				surrendarReasonMap.put(app.getValue(), value.substring(0, app.getValue().indexOf('|')));
			else
				surrendarReasonMap.put(app.getValue(), app.getValue());
		}
		return surrendarReasonMap;
	}

	public Object toSearchResultJson(final Object object) {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		final Gson gson = gsonBuilder.registerTypeAdapter(ChequeReportModel.class, new ChequeReportJsonAdaptor())
				.create();
		return gson.toJson(object);
	}

}
