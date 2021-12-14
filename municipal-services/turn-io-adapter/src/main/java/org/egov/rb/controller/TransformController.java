package org.egov.rb.controller;

import org.egov.rb.contract.MessageRequest;
import org.egov.rb.pgrmodels.ServiceResponse;
import org.egov.rb.repository.ServiceRequestRepository;
import org.egov.rb.service.TransformService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/")
public class TransformController {
	
	@Autowired
	private TransformService transformService;
	
	/**Dharamshala0
	 * contoller endpoint to transform the messageRequest
	 * 
	 * @param messageRequest
	 * @return ResponseEntity<?>
	 * 
	 */	
	
	@PostMapping("_transform")
	public ResponseEntity<?> transformService(@RequestBody MessageRequest messageRequest) {	
	
		Object response = transformService.transform(messageRequest);
			
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
