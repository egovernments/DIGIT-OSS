package org.egov.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MessagesResponse {
	private List<Message> messages;
}
