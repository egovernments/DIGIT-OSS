package org.egov.demand.web.validator;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.service.BusinessServDetailService;
import org.egov.demand.service.TaxHeadMasterService;
import org.egov.demand.service.TaxPeriodService;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.demand.web.contract.TaxHeadMasterRequest;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Deprecated
public class TaxHeadMasterValidator implements Validator {

	@Autowired
	private TaxHeadMasterService taxHeadMasterService;

	@Autowired
	private TaxPeriodService taxPeriodService;
	
	@Autowired
	private BusinessServDetailService businessService;
	
	@Override
	public boolean supports(Class<?> clazz) {

		return TaxHeadMasterRequest.class.equals(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {

		TaxHeadMasterRequest taxHeadMasterRequest = null;
		if (target instanceof TaxHeadMasterRequest)
			taxHeadMasterRequest = (TaxHeadMasterRequest) target;
		else
			throw new RuntimeException("Invalid Object type for GlCodeMaster validator");
		validateTaxHeads(taxHeadMasterRequest, errors);
//		validateTaxPeriod(taxHeadMasterRequest,errors);
	}

	public void validateTaxHeads(final TaxHeadMasterRequest taxHeadsRequest, Errors error) {
		log.debug(":::::in validator class:::::::" + taxHeadsRequest);
		List<TaxHeadMaster> taxHeads = taxHeadsRequest.getTaxHeadMasters();
		TaxHeadMasterCriteria taxHeadMasterCriteria = null;
		BusinessServiceDetailCriteria businessServiceDetailCriteria = null;
		Set<String> bServices = new HashSet<>();

		for (TaxHeadMaster master : taxHeads) {

			if (!master.getTenantId().equalsIgnoreCase(taxHeads.get(0).getTenantId()))
				error.rejectValue("TaxHeadMasters", "", "Tenant id should be same in all objects");

			bServices.add(master.getService());
			businessServiceDetailCriteria = BusinessServiceDetailCriteria.builder().tenantId(master.getTenantId())
					.businessService(bServices).build();
			List<BusinessServiceDetail> businessServiceDetails = businessService
					.searchBusinessServiceDetails(businessServiceDetailCriteria, taxHeadsRequest.getRequestInfo())
					.getBusinessServiceDetails();

			if (businessServiceDetails.isEmpty())
				error.rejectValue("TaxHeadMasters", "", "BusinessService: " + master.getService() + " does not exist");

			Set<String> code = new HashSet<>();
			code.add(master.getCode());
			bServices.add(master.getService());
			taxHeadMasterCriteria = TaxHeadMasterCriteria.builder().tenantId(master.getTenantId())
					.service(master.getService()).code(code).build();

			final TaxHeadMasterResponse taxHeadMasterResponse = taxHeadMasterService.getTaxHeads(taxHeadMasterCriteria,
					taxHeadsRequest.getRequestInfo());

			if (!taxHeadMasterResponse.getTaxHeadMasters().isEmpty())
				error.rejectValue("TaxHeadMasters", "", "Record with tenantId: " + master.getTenantId() + ", Service: "
						+ master.getService() + " and Code: " + master.getCode() + " Already exist");
		}
	}
	
	/*private void validateTaxPeriod(TaxHeadMasterRequest taxHeadMatserRequest, Errors errors) {

		List<TaxHeadMaster> taxHeadMasters = taxHeadMatserRequest.getTaxHeadMasters();
		Long startDate = taxHeadMasters.get(0).getValidFrom();
		Long endDate = taxHeadMasters.get(0).getValidTill();
		String tenantId = taxHeadMasters.get(0).getTenantId();
		Set<String> businessServiceDetails = new HashSet<>();

		for (TaxHeadMaster taxHead : taxHeadMasters) {
			businessServiceDetails.add(taxHead.getService());
			if (startDate > taxHead.getValidFrom())
				startDate = taxHead.getValidFrom();
			if (endDate < taxHead.getValidTill())
				endDate = taxHead.getValidTill();
		}

		TaxPeriodCriteria taxPeriodCriteria = TaxPeriodCriteria.builder().service(businessServiceDetails)
				.fromDate(startDate).toDate(endDate).tenantId(tenantId).build();
		Map<String, List<TaxPeriod>> taxPeriodMap = taxPeriodService
				.searchTaxPeriods(taxPeriodCriteria, taxHeadMatserRequest.getRequestInfo()).getTaxPeriods().stream()
				.collect(Collectors.groupingBy(TaxPeriod::getService));
		for (TaxHeadMaster taxHeadMaster : taxHeadMasters) {
			List<TaxPeriod> taxPeriods = taxPeriodMap.get(taxHeadMaster.getService());

			if (taxPeriods != null) {
				TaxPeriod taxPeriod = taxPeriods.stream()
						.filter(t -> taxHeadMaster.getValidFrom().compareTo(t.getFromDate()) <= 0
								&& taxHeadMaster.getValidTill().compareTo(t.getToDate()) >= 0)
						.findAny().orElse(null);
				if (taxPeriod == null)
					errors.rejectValue("TaxHeadMasters", "",
							"the given taxPeriod value validFrom : '" + taxHeadMaster.getValidFrom()
									+ "and validTill : " + taxHeadMaster.getValidTill()
									+ "'in TaxHeadMaster is invalid, please give a valid taxPeriod");
			} else {
				errors.rejectValue("TaxHeadMasters", "",
						"the taxPeriod not found for tenantId:" + taxHeadMaster.getTenantId() + " validFrom : '"
								+ taxHeadMaster.getValidFrom() + "and validTill : " + taxHeadMaster.getValidTill()
								+ "'in TaxHeadMaster is invalid, please give a valid taxPeriod");
			}
		}
	}*/
}
