package org.bel.birthdeath.common.services;

import java.lang.annotation.Documented;
import java.util.ArrayList;
import java.util.List;

import org.bel.birthdeath.birth.model.ImportBirthWrapper;
import org.bel.birthdeath.common.contract.BirthResponse;
import org.bel.birthdeath.common.contract.DeathResponse;
import org.bel.birthdeath.common.model.EgHospitalDtl;
import org.bel.birthdeath.common.repository.CommonRepository;
import org.bel.birthdeath.death.model.ImportDeathWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommonService {

	private CommonRepository repository;

	@Autowired
	public CommonService(CommonRepository repository) {
		this.repository = repository;
	}

	/**
	 * Search hospitals with tenantId
	 * @param tenantId
	 * @return list of hospitals
	 */
	public List<EgHospitalDtl> search(String tenantId) {
		List<EgHospitalDtl> hospitalDtls = new ArrayList<>() ;
		hospitalDtls = repository.getHospitalDtls(tenantId);
		return hospitalDtls;
	}

	/**
	 * saves birth details
	 * @param importJSon birth details
	 * @param requestInfo which consists of user details and auth token
	 * @return ImportBirthWrapper
	 */
	public ImportBirthWrapper saveBirthImport(BirthResponse importJSon, RequestInfo requestInfo) {
		return repository.saveBirthImport(importJSon, requestInfo);
	}

	/**
	 * saves death details
	 * @param importJSon death details
	 * @param requestInfo which consists of user details and auth token
	 * @return ImportDeathWrapper
	 */
	public ImportDeathWrapper saveDeathImport(DeathResponse importJSon, RequestInfo requestInfo) {
		return repository.saveDeathImport(importJSon, requestInfo);
	}

	/**
	 * updates birth details
	 * @param importJSon birth details
	 * @param requestInfo which consists of user details and auth token
	 * @return ImportBirthWrapper
	 */
	public ImportBirthWrapper updateBirthImport(BirthResponse importJSon, RequestInfo requestInfo) {
		return repository.updateBirthImport(importJSon, requestInfo);
	}

	/**
	 * updates death details
	 * @param importJSon death details
	 * @param requestInfo which consists of user details and auth token
	 * @return ImportDeathWrapper
	 */
	public ImportDeathWrapper updateDeathImport(DeathResponse importJSon, RequestInfo requestInfo) {
		return repository.updateDeathImport(importJSon, requestInfo);
	}

}
