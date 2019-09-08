package org.egov.pt.web.controllers;

import org.egov.pt.service.DraftsService;
import org.egov.pt.web.models.DraftRequest;
import org.egov.pt.web.models.DraftResponse;
import org.egov.pt.web.models.DraftSearchCriteria;
import org.egov.pt.web.models.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;

@Controller
@RequestMapping("/drafts")
public class DraftsController {
	
	@Autowired
	private DraftsService draftsService;
	
	
	@RequestMapping(value = "/_create", method = RequestMethod.POST)
	public ResponseEntity<DraftResponse> create(@Valid @RequestBody DraftRequest draftRequest) {
		DraftResponse response = draftsService.createDraft(draftRequest);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/_update", method = RequestMethod.POST)
	public ResponseEntity<DraftResponse> update(@Valid @RequestBody DraftRequest draftRequest) {
		DraftResponse response = draftsService.updateDraft(draftRequest);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/_search", method = RequestMethod.POST)
	public ResponseEntity<DraftResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfo, @Valid
	@ModelAttribute DraftSearchCriteria draftSearchCriteria) {
		DraftResponse response = draftsService.searchDrafts(requestInfo.getRequestInfo(), draftSearchCriteria);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
