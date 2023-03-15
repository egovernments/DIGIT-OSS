package org.egov.model;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestCaptureCriteria {
    boolean captureInputBody;
    boolean captureOutputBody;
    boolean captureOutputBodyOnlyForError;

}
