package org.egov.batchtelemetry.models;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class InputNode {

    private String nodeName;

    private String url;

}
