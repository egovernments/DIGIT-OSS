package org.egov.egovdocumentuploader.web.models;

import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Validated
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class Event {

    @NotNull
    private String tenantId;

    private String id;

    @NotNull
    private String eventType;

    private String name;

    @NotNull
    private String description;

    @NotNull
    private String source;

    private Action actions;

    private EventDetails eventDetails;


}
