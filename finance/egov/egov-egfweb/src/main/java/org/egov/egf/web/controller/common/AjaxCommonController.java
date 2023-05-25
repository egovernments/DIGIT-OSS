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
package org.egov.egf.web.controller.common;

import static org.egov.infra.web.support.json.adapter.HibernateProxyTypeAdapter.FACTORY;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.commons.Accountdetailtype;
import org.egov.commons.Bankaccount;
import org.egov.commons.Bankbranch;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.CFunction;
import org.egov.commons.Fundsource;
import org.egov.commons.Scheme;
import org.egov.commons.SubScheme;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.commons.service.ChartOfAccountsService;
import org.egov.commons.service.EntityTypeService;
import org.egov.commons.service.FunctionService;
import org.egov.commons.service.FundsourceService;
import org.egov.commons.utils.EntityType;
import org.egov.egf.billsubtype.service.EgBillSubTypeService;
import org.egov.egf.commons.bankaccount.service.CreateBankAccountService;
import org.egov.egf.commons.bankbranch.service.CreateBankBranchService;
import org.egov.egf.masters.services.PurchaseOrderService;
import org.egov.egf.masters.services.WorkOrderService;
import org.egov.egf.web.adaptor.ChartOfAccountsAdaptor;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.exception.ApplicationException;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.model.bills.EgBillSubType;
import org.egov.model.masters.PurchaseOrder;
import org.egov.model.masters.WorkOrder;
import org.egov.services.masters.SchemeService;
import org.egov.services.masters.SubSchemeService;
import org.egov.utils.FinancialConstants;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonSerializer;

/**
 * @author venki
 *
 */

@Controller
@RequestMapping(value = "/common")
@Validated
public class AjaxCommonController {
    private static final Logger LOGGER = Logger.getLogger(AjaxCommonController.class);

    @Autowired
    @Qualifier("schemeService")
    private SchemeService schemeService;

    @Autowired
    @Qualifier("subSchemeService")
    private SubSchemeService subSchemeService;

    @Autowired
    private CreateBankBranchService createBankBranchService;

    @Autowired
    private FundsourceService fundsourceService;

    @Autowired
    private FunctionService functionService;

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private AccountdetailtypeService accountdetailtypeService;

    @Autowired
    @Qualifier("chartOfAccountsService")
    private ChartOfAccountsService chartOfAccountsService;

    @Autowired
    private EgBillSubTypeService egBillSubTypeService;

    @Autowired
    private AppConfigValueService appConfigValueService;

    @Autowired
    private CreateBankAccountService createBankAccountService;

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private WorkOrderService workOrderService;

    @Autowired
    private MicroserviceUtils microserviceUtils;

    @GetMapping(value = "/getschemesbyfundid")
    @ResponseBody
    public List<Scheme> getAllSchemesByFundId(@RequestParam("fundId") @SafeHtml final String fundId)
            throws ApplicationException {
        return schemeService.getByFundId(Integer.parseInt(fundId));
    }

    @GetMapping(value = "/getpurchaseodersbysupplierid")
    @ResponseBody
    public List<PurchaseOrder> getAllPurchaseOrdersBySupplierId(@RequestParam("supplierId") @SafeHtml final String supplierId)
            throws ApplicationException {
        return purchaseOrderService.getBySupplierId(Long.parseLong(supplierId));
    }

    @GetMapping(value = "/getpurchaseoderbyordernumber")
    @ResponseBody
    public List<PurchaseOrder> getAllPurchaseOrderByOrderNumber(@RequestParam("orderNumber") @SafeHtml final String orderNumber)
            throws ApplicationException {
        PurchaseOrder po = purchaseOrderService.getByOrderNumber(orderNumber);
        Department dept = microserviceUtils.getDepartmentByCode(po.getDepartment());
        po.setDescription(dept.getName());
        return Collections.singletonList(po);
    }

    @GetMapping(value = "/getworkordersbycontractorid")
    @ResponseBody
    public List<WorkOrder> getAllWorkOrdersByContractorId(@RequestParam("contractorId") @SafeHtml final String contractorId)
            throws ApplicationException {
        return workOrderService.getByContractorId(Long.parseLong(contractorId));
    }

    @GetMapping(value = "/getworkorderbyordernumber")
    @ResponseBody
    public List<WorkOrder> getAllWorkOrderByOrderNumber(@RequestParam("orderNumber") @SafeHtml final String orderNumber)
            throws ApplicationException {
        WorkOrder wo = workOrderService.getByOrderNumber(orderNumber);
        Department dept = microserviceUtils.getDepartmentByCode(wo.getDepartment());
        wo.setDescription(dept.getName());
        return Collections.singletonList(wo);
    }

    @GetMapping(value = "/getsubschemesbyschemeid")
    @ResponseBody
    public List<SubScheme> getAllSubSchemesBySchemeId(@RequestParam("schemeId") @SafeHtml final String schemeId)
            throws ApplicationException {
        return subSchemeService.getBySchemeId(Integer.parseInt(schemeId));
    }

    @GetMapping(value = "/getfundsourcesbysubschemeid")
    @ResponseBody
    public List<Fundsource> getAllFundSourcesBySubSchemeId(
            @RequestParam("subSchemeId") @SafeHtml final String subSchemeId) throws ApplicationException {
        return fundsourceService.getBySubSchemeId(Integer.parseInt(subSchemeId));
    }

    @GetMapping(value = "/ajaxfunctionnames", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<String> findFunctionNames(@RequestParam @SafeHtml final String name) {
        final List<String> functionNames = new ArrayList<>();
        final List<CFunction> functions = functionService.findByNameLikeOrCodeLike(name);
        for (final CFunction function : functions)
            if (!function.getIsNotLeaf().booleanValue())
                functionNames.add(function.getCode() + " - " + function.getName() + " ~ " + function.getId());

        return functionNames;
    }

    @SuppressWarnings("unchecked")
	@GetMapping(value = "/getentitesbyaccountdetailtype", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<String> findEntitesByAccountDetailType(@RequestParam @SafeHtml final String name,
            @RequestParam @SafeHtml final String accountDetailType) {
        final List<String> entityNames = new ArrayList<>();
        List<EntityType> entitiesList = new ArrayList<>();
        final Accountdetailtype detailType = accountdetailtypeService.findOne(Integer.parseInt(accountDetailType));
        try {
            final String table = detailType.getFullQualifiedName();
            final Class<?> service = Class.forName(table);
            String simpleName = service.getSimpleName();
            simpleName = simpleName.substring(0, 1).toLowerCase() + simpleName.substring(1) + "Service";

            final EntityTypeService entityService = (EntityTypeService) applicationContext.getBean(simpleName);
            entitiesList = (List<EntityType>) entityService.filterActiveEntities(name, 20, detailType.getId());
        } catch (final ClassNotFoundException e) {
            LOGGER.error("Error occured entity is not found" + e.getMessage());
            entitiesList = new ArrayList<>();
        }
        for (final EntityType entity : entitiesList)
            entityNames.add(entity.getCode() + " - " + entity.getName() + "~" + entity.getEntityId());

        return entityNames;
    }

	@GetMapping(value = "/getsupplierdebitcodes", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String findSupplierDebitAccountCodes(@RequestParam @SafeHtml final String glcode) {
		final List<CChartOfAccounts> chartOfAccounts = chartOfAccountsService.getSupplierDebitAccountCodes(glcode);
		for (final CChartOfAccounts coa : chartOfAccounts)
			coa.setIsSubLedger(!coa.getChartOfAccountDetails().isEmpty());
		return toJSON(chartOfAccounts, CChartOfAccounts.class, ChartOfAccountsAdaptor.class);
	}

	@GetMapping(value = "/getsuppliercreditcodes", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String findSupplierCreditAccountCodes(@RequestParam @SafeHtml final String glcode) {
		final List<CChartOfAccounts> chartOfAccounts = chartOfAccountsService.getSupplierCreditAccountCodes(glcode);
		for (final CChartOfAccounts coa : chartOfAccounts)
			coa.setIsSubLedger(!coa.getChartOfAccountDetails().isEmpty());
		return toJSON(chartOfAccounts, CChartOfAccounts.class, ChartOfAccountsAdaptor.class);
	}

	@GetMapping(value = "/getcontractordebitcodes", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String findContractorDebitAccountCodes(@RequestParam @SafeHtml final String glcode) {
		final List<CChartOfAccounts> chartOfAccounts = chartOfAccountsService.getContractorDebitAccountCodes(glcode);
		for (final CChartOfAccounts coa : chartOfAccounts)
			coa.setIsSubLedger(!coa.getChartOfAccountDetails().isEmpty());
		return toJSON(chartOfAccounts, CChartOfAccounts.class, ChartOfAccountsAdaptor.class);
	}

	@GetMapping(value = "/getcontractorcreditcodes", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String findContractorCreditAccountCodes(@RequestParam @SafeHtml final String glcode) {
		final List<CChartOfAccounts> chartOfAccounts = chartOfAccountsService.getContractorCreditAccountCodes(glcode);
		for (final CChartOfAccounts coa : chartOfAccounts)
			coa.setIsSubLedger(!coa.getChartOfAccountDetails().isEmpty());
		return toJSON(chartOfAccounts, CChartOfAccounts.class, ChartOfAccountsAdaptor.class);
	}

	@GetMapping(value = "/getaccountcodesforaccountdetailtype", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String findAccountCodesForAccountDetailType(@RequestParam @SafeHtml final String glcode,
			@RequestParam @SafeHtml final String accountDetailType) {
		final List<CChartOfAccounts> chartOfAccounts = chartOfAccountsService
				.getSubledgerAccountCodesForAccountDetailTypeAndNonSubledgers(Integer.parseInt(accountDetailType),
						glcode);
		for (final CChartOfAccounts coa : chartOfAccounts)
			coa.setIsSubLedger(!coa.getChartOfAccountDetails().isEmpty());
		return toJSON(chartOfAccounts, CChartOfAccounts.class, ChartOfAccountsAdaptor.class);
	}

	@GetMapping(value = "/getnetpayablecodesbyaccountdetailtype", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String getNetPayableCodesByAccountDetailType(
			@RequestParam("accountDetailType") @SafeHtml final String accountDetailType) throws ApplicationException {
		final List<CChartOfAccounts> chartOfAccounts = chartOfAccountsService
				.getNetPayableCodesByAccountDetailType(Integer.parseInt(accountDetailType));
		for (final CChartOfAccounts coa : chartOfAccounts)
			coa.setIsSubLedger(!coa.getChartOfAccountDetails().isEmpty());
		return toJSON(chartOfAccounts, CChartOfAccounts.class, ChartOfAccountsAdaptor.class);
	}

    @GetMapping(value = "/getchecklistbybillsubtype", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<AppConfigValues> getCheckListByBillSubType(
            @RequestParam("billSubType") @SafeHtml final String billSubType) {
        final EgBillSubType egBillSubType = egBillSubTypeService.getById(Long.parseLong(billSubType));

        List<AppConfigValues> checkList;
        checkList = appConfigValueService.getConfigValuesByModuleAndKey(FinancialConstants.MODULE_NAME_APPCONFIG,
                egBillSubType.getName());
        if (checkList == null || checkList.isEmpty())
            checkList = appConfigValueService.getConfigValuesByModuleAndKey(FinancialConstants.MODULE_NAME_APPCONFIG,
                    FinancialConstants.CBILL_DEFAULTCHECKLISTNAME);

        return checkList;
    }

	@GetMapping(value = "/getallaccountcodes", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String findAllAccountCodes(@RequestParam @SafeHtml final String glcode) {
		final List<CChartOfAccounts> chartOfAccounts = chartOfAccountsService.getAllAccountCodes(glcode);
		for (final CChartOfAccounts coa : chartOfAccounts)
			coa.setIsSubLedger(!coa.getChartOfAccountDetails().isEmpty());
		return toJSON(chartOfAccounts, CChartOfAccounts.class, ChartOfAccountsAdaptor.class);
	}

    @GetMapping(value = "/getaccountdetailtypesbyglcodeid")
    @ResponseBody
    public List<Accountdetailtype> getAccountDetailTypesByGlcodeId(@RequestParam("glcodeId") @SafeHtml final String glcodeId)
            throws ApplicationException {
        return accountdetailtypeService.findByGlcodeId(Long.parseLong(glcodeId));
    }

    @GetMapping(value = "/getbankbranchesbybankid")
    @ResponseBody
    public List<Bankbranch> getBankbranchesByBankId(@RequestParam("bankId") @SafeHtml final String bankId)
            throws ApplicationException {
        if (!"0".equals(bankId))
            return createBankBranchService.getByBankId(Integer.parseInt(bankId));
        else
            return createBankBranchService.getByIsActiveTrueOrderByBranchname();
    }

    @GetMapping(value = "/getbankaccountbybranchid")
    @ResponseBody
    public List<Bankaccount> getBankAccountByBranchId(@RequestParam("branchId") @SafeHtml final String branchId)
            throws ApplicationException {
        return createBankAccountService.getByBranchId(Integer.parseInt(branchId));
    }

    public static <T> String toJSON(final Collection<T> objects, final Class<? extends T> objectClazz,
            final Class<? extends JsonSerializer<T>> adptorClazz) {
        try {
            return new GsonBuilder().registerTypeAdapterFactory(FACTORY)
                    .registerTypeAdapter(objectClazz, adptorClazz.newInstance()).create().toJson(objects);
        } catch (InstantiationException | IllegalAccessException e) {
            throw new ApplicationRuntimeException("Could not convert object list to json string", e);
        }
    }

}
