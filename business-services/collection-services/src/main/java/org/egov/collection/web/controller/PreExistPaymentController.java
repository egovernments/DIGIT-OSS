package org.egov.collection.web.controller;

import java.util.List;

import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.service.PreExistPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/preexistpayments")
public class PreExistPaymentController {

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private PreExistPaymentService preExistPaymentService;

	@PostMapping(value = "/_update")
	@ResponseBody
	public void update() {
		List<String> ifsccodeList = paymentRepository.fetchIfsccode();
		ifsccodeList.forEach(ifsccode -> preExistPaymentService.updatePaymentBankDetails(ifsccode));
	}
}
