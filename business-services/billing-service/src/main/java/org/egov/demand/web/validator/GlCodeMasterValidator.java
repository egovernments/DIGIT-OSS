package org.egov.demand.web.validator;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.egov.demand.model.GlCodeMaster;
import org.egov.demand.model.GlCodeMasterCriteria;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.service.GlCodeMasterService;
import org.egov.demand.service.TaxHeadMasterService;
import org.egov.demand.web.contract.GlCodeMasterRequest;
import org.egov.demand.web.contract.GlCodeMasterResponse;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Deprecated
public class GlCodeMasterValidator implements Validator {

	@Autowired
	private GlCodeMasterService glCodeMasterService;

	@Autowired
	private TaxHeadMasterService taxHeadMasterService;

	@Override
	public boolean supports(Class<?> clazz) {

		return GlCodeMasterRequest.class.equals(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {

		GlCodeMasterRequest glCodeMasterRequest = null;
		if (target instanceof GlCodeMasterRequest)
			glCodeMasterRequest = (GlCodeMasterRequest) target;
		else
			throw new RuntimeException("Invalid Object type for GlCodeMaster validator");
		validateGlCodeMaster(glCodeMasterRequest, errors);
	}

	public void validateGlCodeMaster(final GlCodeMasterRequest glCodeMasterRequest, Errors error) {
		log.debug(":::::in validator class:::::::" + glCodeMasterRequest);
		GlCodeMasterCriteria glCodeMasterCriteria = null;
		TaxHeadMasterCriteria taxHeadCriteria = null;
		List<GlCodeMaster> glCodes = glCodeMasterRequest.getGlCodeMasters();
		for (GlCodeMaster master : glCodes) {
			if(!master.getTenantId().equalsIgnoreCase(glCodes.get(0).getTenantId()))
				error.rejectValue("GlCodeMasters","","Tenant id should be same in all objects");
			Set<String> codes = new HashSet<String>();
			codes.add(master.getTaxHead());

			glCodeMasterCriteria = GlCodeMasterCriteria.builder().tenantId(master.getTenantId())
					.service(master.getService()).taxHead(codes).fromDate(master.getFromDate())
					.toDate(master.getToDate()).glCode(master.getGlCode()).build();

			final GlCodeMasterResponse glCodeMasterResponse = glCodeMasterService.getGlCodes(glCodeMasterCriteria,
					glCodeMasterRequest.getRequestInfo());

			if (!glCodeMasterResponse.getGlCodeMasters().isEmpty())
				error.rejectValue("GlCodeMasters", "", "Record Already exist");

			taxHeadCriteria = TaxHeadMasterCriteria.builder().code(codes).tenantId(master.getTenantId())
					.service(master.getService()).build();

			TaxHeadMasterResponse taxHeadMasterResponse = taxHeadMasterService.getTaxHeads(taxHeadCriteria,
					glCodeMasterRequest.getRequestInfo());
			if (taxHeadMasterResponse.getTaxHeadMasters().isEmpty())
				error.rejectValue("GlCodeMasters", "", "The TaxHead provided is invalid");
		}
	}
}
