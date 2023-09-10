package org.egov.pt.models.hrms;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import lombok.Data;

@Data
public class HRMSResponse {
    private ResponseInfo responseInfo;
    private List<Employee> employees;
}