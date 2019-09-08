package org.egov.pg.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.pg.web.models.ResponseInfo;

import java.util.List;

@Getter
@AllArgsConstructor
public class IdGenerationResponse {

    private ResponseInfo responseInfo;

    private List<IdResponse> idResponses;

}
