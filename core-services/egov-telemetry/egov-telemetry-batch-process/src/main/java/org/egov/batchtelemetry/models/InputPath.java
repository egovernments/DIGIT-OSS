package org.egov.batchtelemetry.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class InputPath {

    private String pathId;

    private List<InputNode> inputNodes;

}
