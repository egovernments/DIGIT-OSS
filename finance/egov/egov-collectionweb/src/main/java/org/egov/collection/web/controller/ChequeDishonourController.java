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
package org.egov.collection.web.controller;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.TreeMap;

import javax.persistence.NoResultException;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.egov.collection.constants.CollectionConstants;
import org.egov.collection.entity.DishonoredChequeBean;
import org.egov.collection.integration.services.DishonorChequeService;
import org.egov.commons.dao.BankBranchHibernateDAO;
import org.egov.infstr.services.PersistenceService;
import org.egov.services.instrument.InstrumentService;
import org.hibernate.validator.constraints.SafeHtml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@SuppressWarnings("deprecation")
@Controller
@RequestMapping(value = { "/dishonour/cheque" })
@Validated
public class ChequeDishonourController {
    
    private static final String ERROR_MESSAGE = "errorMessage";
	private static final Logger LOGGER = LoggerFactory.getLogger(ChequeDishonourController.class);

    public ChequeDishonourController() {
        LOGGER.debug("ChequeDishonourController class initialized");
    }

    @Autowired
    private BankBranchHibernateDAO bankBranchHibernateDAO;
    @Autowired
    private DishonorChequeService dishonorChequeService;
    @Autowired
    @Qualifier("instrumentService")
    private InstrumentService instrumentService;
    @SuppressWarnings("rawtypes")
	@Autowired
    @Qualifier("persistenceService")
    protected PersistenceService persistenceService;

	@RequestMapping(method = { RequestMethod.POST, RequestMethod.GET }, value = "/form")
    public String getDishonourChequeForm(final Model model, @ModelAttribute(ERROR_MESSAGE) @SafeHtml final String errorMessage) {
        if (errorMessage != null)
            model.addAttribute(ERROR_MESSAGE, errorMessage);
        model.addAttribute(CollectionConstants.DROPDOWN_DATA_BANKBRANCH_LIST,
                bankBranchHibernateDAO.getAllBankBranchs());
        model.addAttribute(CollectionConstants.DROPDOWN_DATA_ACCOUNT_NO_LIST, Collections.emptyList());
        model.addAttribute(CollectionConstants.DROPDOWN_DATA_DISHONOR_REASONS_LIST,
                persistenceService.getSession().createSQLQuery("select * from egf_instrument_dishonor_reason").list());
        final DishonoredChequeBean attributeValue = new DishonoredChequeBean();
        attributeValue.setDishonorDate(new Date());
        model.addAttribute("dishonoredChequeModel", attributeValue);
        model.addAttribute("instrumentModesMap", getInstrumentModeMap());
        return "dishonour-cheque-form";
    }

    private TreeMap<String, String> getInstrumentModeMap() {
        final TreeMap<String, String> instMap = new TreeMap<>();
        instMap.put("Cheque", "Cheque");
        instMap.put("DD", "DD");
        return instMap;
    }

    @SuppressWarnings("rawtypes")
	@GetMapping(value = "/_search")
    public @ResponseBody ResponseEntity getDishonorChequeSearch(@Valid @ModelAttribute final DishonoredChequeBean model,final BindingResult errors){
        try {
            dishonorChequeService.validateBeforeSearch(model, errors);
            if (errors.hasErrors()) {
                LOGGER.error(errors.getAllErrors().toString());
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(getDishonorCheque(model), HttpStatus.OK);
        } catch (final HttpClientErrorException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/bankAccount/_search")
    public @ResponseBody List<Object[]> searchBankAccount(
            @RequestParam(name = "fundId", required = false) final int fundId,
            @RequestParam("branchId") final int branchId) {
        return instrumentService.getBankAccount(fundId, branchId);
    }

    @RequestMapping(method = { RequestMethod.GET, RequestMethod.POST }, value = "/submit")
    public String submit(@Valid @ModelAttribute final DishonoredChequeBean chequeBean, final Model model,
            final RedirectAttributes redAttribute,final BindingResult errors) {
        final String returnPage = "dishonor_cheque_success";
            dishonorChequeService.validateManadatoryFields(chequeBean,errors);
            if(errors.hasErrors()) {
                redAttribute.addFlashAttribute(ERROR_MESSAGE,
                        "Error occurred while doing dishonoring of Instrument Number " + chequeBean.getInstrumentNumber()
                                + ". Please contact to Administration.");
            return "redirect:/dishonour/cheque/form";
            }
        try {
            dishonorChequeService.processDishonor(chequeBean);
            model.addAttribute("dishonoredChequeModel", chequeBean);
            return returnPage;
        } catch (final NoResultException e) {
            LOGGER.error("Error Occurred while doing dishonoring of Instrument Number : {}",
                    chequeBean.getInstrumentNumber());
            redAttribute.addFlashAttribute(ERROR_MESSAGE,
                    "Error occurred while doing dishonoring of Instrument Number " + chequeBean.getInstrumentNumber()
                            + ". Please contact to Administration.");
            return "redirect:/dishonour/cheque/form";
        }
    }

    private List<DishonoredChequeBean> getDishonorCheque(final DishonoredChequeBean model) {
        final String bankBranch = model.getBankBranch();
        String bankId = null;
        if (StringUtils.isNotBlank(bankBranch))
            bankId = bankBranch.split("-")[0].trim();
        return dishonorChequeService.getCollectionListForDishonorInstrument(model.getInstrumentMode(), bankId,
                model.getAccountNumber(), model.getInstrumentNumber(), model.getTransactionDate());
    }

}
