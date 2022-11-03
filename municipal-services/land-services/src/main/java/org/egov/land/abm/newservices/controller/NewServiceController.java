package org.egov.land.abm.newservices.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.land.abm.newservices.entity.*;
import org.egov.land.abm.service.NewServiceInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("new")
public class NewServiceController {

	@Autowired NewServiceInfoService newServiceInfoService;
	
	@PostMapping(value = "_create")
	public NewServiceInfo createNewService(@RequestBody NewService newService) throws JsonProcessingException {
		
		System.out.println("=========CREATE NEW LAND SERVICE ===========");
		
		NewServiceInfo newServiceInfo = newServiceInfoService.createNewServic(newService.getNewServiceInfo());
		//newService.setNewServiceInfo(getNewService());
		
		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(newService);
		
		System.out.println("new license json object ===============> " + json);
		
	
		return newServiceInfo;
	}
	
	
	public String Step1Data() {
		List<Step1> list = new ArrayList<>();
		return null;
	}

	
	public NewServiceInfo getNewService() {

		

		Step1 step1 = new Step1();
		step1.setDeveloper("Developer");

		Step2 step2 = new Step2();
		step2.setKhasra("khasra");

		Step3 step3 = new Step3();
		step3.setLicenseApplied("licensed Applied");

		Step3Data1 step3Data1 = new Step3Data1();
		step3Data1.setApproach("Approach");

		Step3Data2 step3Data2 = new Step3Data2();
		step3Data2.setAcquistion("Acquisition");

		step3.setStep3Data1(step3Data1);
		step3.setStep3Data2(step3Data2);

		Step4 step4 = new Step4();
		step4.setDgps("dgps");
		
		NewServiceInfoData newServiceInfoData = new NewServiceInfoData();
		newServiceInfoData.setStep1(step1);
		newServiceInfoData.setStep2(step2);
		newServiceInfoData.setStep3(step3);
		newServiceInfoData.setStep4(step4);
		//newServiceInfoData.setStep5(step5);
		
		NewServiceInfo newServiceInfo = new NewServiceInfo();
		newServiceInfo.setCreatedBy("Rahul");
		newServiceInfo.setCreatedDate(new Date());
		newServiceInfo.setId(1l);
		newServiceInfo.setNewServiceInfoData(newServiceInfoData);


		return newServiceInfo;
	}

}
