package org.egov.collection.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class IdGenerationResponse {

    private ResponseInfo responseInfo;

    private List<IdResponse> idResponses;

}
