package org.egov.egf.web.controller.microservice;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class InBoxController {

	@PostMapping("/inbox")
	public String showInbox(){
		return "inbox-view";
	}
}
