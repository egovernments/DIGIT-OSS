package org.egov.dataupload.repository;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.dataupload.model.UploadJob;
import org.egov.dataupload.model.UploadJob.StatusEnum;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class UploadJobRowMapper implements RowMapper<UploadJob>{
	
	@Override
	public UploadJob mapRow(ResultSet rs, int rowNum) throws SQLException {
		
		UploadJob uploadJob=new UploadJob();
		uploadJob.setCode(rs.getString("code"));
		uploadJob.setTenantId(rs.getString("tenantId"));
		uploadJob.setRequestFilePath(rs.getString("requestfile_path"));
		uploadJob.setModuleName(rs.getString("module_name"));
		uploadJob.setDefName(rs.getString("def_name"));
		uploadJob.setRequesterName(rs.getString("requester_name"));
		uploadJob.setStartTime(rs.getLong("start_time"));
		uploadJob.setEndTime(rs.getLong("end_time"));
		uploadJob.setTotalRows(rs.getInt("total_rows"));
		uploadJob.setSuccessfulRows(rs.getInt("success_rows"));
		uploadJob.setFailedRows(rs.getInt("failed_rows"));
		uploadJob.setStatus(StatusEnum.fromValue(rs.getString("status")));
		uploadJob.setResponseFilePath(rs.getString("responsefile_path"));
		uploadJob.setRequestFileName(rs.getString("file_name"));
		uploadJob.setReasonForFailure(rs.getString("reason_for_failure"));
	

		return uploadJob;
	}
}
