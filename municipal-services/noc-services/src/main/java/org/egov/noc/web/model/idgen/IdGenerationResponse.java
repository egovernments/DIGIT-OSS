package org.egov.noc.web.model.idgen;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IdGenerationResponse {

    private ResponseInfo responseInfo;

    private List<IdResponse> idResponses;
}
