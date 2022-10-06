package org.egov.user.avm.developer.controller;

import java.util.List;

import javax.validation.Valid;

import org.egov.user.avm.developer.entity.DeveloperRegistration;
import org.egov.user.avm.developer.services.DeveloperRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;


@RestController
@RequestMapping("/developer")
public class DeveloperRegistrationController {

	
	@Autowired DeveloperRegistrationService developerRegistrationService;
	
	@PostMapping("/_registration")
	public DeveloperRegistration createDeveloperRegistraion(@RequestBody @Valid DeveloperRegistration developerRegistration) throws JsonProcessingException {
		
		
		System.out.println("Registration Api..");
		return developerRegistrationService.addDeveloperRegistraion(developerRegistration);
		
	}
	
	@GetMapping("/_searchall")
	public List<DeveloperRegistration> searchDeveloperRegistraion(){
		
		
		System.out.println("Searching api..");
		return this.developerRegistrationService.findAllDeveloperDetail();
		
	}
	
	@GetMapping("/_get")
	public DeveloperRegistration getById(@RequestParam(value = "id") Long id) {
		System.out.println("Developer Id : " + id);
		return developerRegistrationService.getById(id);
		
	}
	
		
		

	
}
