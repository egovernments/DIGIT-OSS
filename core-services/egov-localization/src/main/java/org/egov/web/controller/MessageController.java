package org.egov.web.controller;

import org.egov.domain.model.MessageSearchCriteria;
import org.egov.domain.model.Tenant;
import org.egov.domain.service.MessageService;
import org.egov.web.contract.*;
import org.egov.web.exception.InvalidMessageRequest;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/messages")
public class MessageController {

	private MessageService messageService;

	public MessageController(MessageService messageService) {
		this.messageService = messageService;
	}

	@GetMapping()
	public MessagesResponse getMessagesForLocale(@RequestParam("locale") String locale,
			@RequestParam(value = "module", required = false) String module,
			@RequestParam("tenantId") String tenantId) {
		return getMessages(locale, module, tenantId);
	}

	@PostMapping("/v1/_search")
	public MessagesResponse getMessages(@RequestParam("locale") String locale,
			@RequestParam(value = "module", required = false) String module,
			@RequestParam("tenantId") String tenantId) {
		final MessageSearchCriteria searchCriteria = MessageSearchCriteria.builder().locale(locale)
				.tenantId(new Tenant(tenantId)).module(module).build();
		List<org.egov.domain.model.Message> domainMessages = messageService.getFilteredMessages(searchCriteria);
		return createResponse(domainMessages);
	}

	@PostMapping("/v1/_upsert")
	public MessagesResponse upsertMessages(@Valid @RequestBody CreateMessagesRequest messageRequest,
			BindingResult bindingResult) {

		if (bindingResult.hasErrors())
			throw new InvalidMessageRequest(bindingResult.getFieldErrors());

		final List<org.egov.domain.model.Message> messages = messageRequest.toDomainMessages();
		messageService.upsert(messageRequest.getTenant(), messages, messageRequest.getAuthenticatedUser());
		return createResponse(messages);
	}

	@PostMapping("/v1/_create")
	public MessagesResponse createMessages(@Valid @RequestBody CreateMessagesRequest messageRequest,
			BindingResult bindingResult) {

		if (bindingResult.hasErrors())
			throw new InvalidMessageRequest(bindingResult.getFieldErrors());

		final List<org.egov.domain.model.Message> messages = messageRequest.toDomainMessages();
		messageService.create(messageRequest.getTenant(), messages, messageRequest.getAuthenticatedUser());
		return createResponse(messages);
	}

	@PostMapping("/cache-bust")
	public CacheBustResponse clearMessagesCache() {
		messageService.bustCache();
		return new CacheBustResponse(null, true);
	}

	private MessagesResponse createResponse(List<org.egov.domain.model.Message> domainMessages) {
		return new MessagesResponse(domainMessages.stream().map(Message::new).collect(Collectors.toList()));
	}

	@PostMapping(value = "/v1/_update")
	public MessagesResponse update(@RequestBody @Valid final UpdateMessageRequest messageRequest,
			final BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new InvalidMessageRequest(bindingResult.getFieldErrors());
		}
		final List<org.egov.domain.model.Message> messages = messageRequest.toDomainMessages();
		messageService.updateMessagesForModule(messageRequest.getTenant(), messages,
				messageRequest.getAuthenticatedUser());
		return createResponse(messages);
	}

	@PostMapping(value = "/v1/_delete")
	public DeleteMessagesResponse delete(@RequestBody @Valid final DeleteMessagesRequest deleteMessagesRequest,
			final BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new InvalidMessageRequest(bindingResult.getFieldErrors());
		}
		messageService.delete(deleteMessagesRequest.getMessageIdentities());
		return new DeleteMessagesResponse(true);
	}

}