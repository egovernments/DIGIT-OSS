package org.egov.edcr.web.adaptor;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import org.egov.edcr.entity.SearchBuildingPlanScrutinyForm;
import org.egov.infra.utils.DateUtils;
import org.egov.infra.web.support.json.adapter.DataTableJsonAdapter;
import org.egov.infra.web.support.ui.DataTable;

import java.lang.reflect.Type;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.isBlank;

public class SearchBuildingPlanScrutinyAdaptor implements DataTableJsonAdapter<SearchBuildingPlanScrutinyForm> {

	public static final String N_A = "N/A";

	@Override
	public JsonElement serialize(final DataTable<SearchBuildingPlanScrutinyForm> planScrutinyReportResponse, final Type type,
								 final JsonSerializationContext jsc) {
		final List<SearchBuildingPlanScrutinyForm> psrResult = planScrutinyReportResponse.getData();
		final JsonArray planScrutinyReportData = new JsonArray();
		psrResult.forEach(baseForm -> {
			final JsonObject jsonObject = new JsonObject();
			jsonObject.addProperty("applicationNumber", isBlank(baseForm.getApplicationNumber()) ? N_A : baseForm.getApplicationNumber());
			jsonObject.addProperty("buildingPlanScrutinyNumber", isBlank(baseForm.getBuildingPlanScrutinyNumber()) ? N_A : baseForm.getBuildingPlanScrutinyNumber());
			jsonObject.addProperty("applicationDate", DateUtils.toDefaultDateFormat(baseForm.getApplicationDate()));
			jsonObject.addProperty("dxfFileStoreId", isBlank(baseForm.getDxfFileStoreId()) ? N_A : baseForm.getDxfFileStoreId());
			jsonObject.addProperty("dxfFileName", isBlank(baseForm.getDxfFileName()) ? N_A : baseForm.getDxfFileName());
			jsonObject.addProperty("reportOutputFileStoreId", isBlank(baseForm.getReportOutputFileStoreId()) ? N_A : baseForm.getReportOutputFileStoreId());
			jsonObject.addProperty("reportOutputFileName", isBlank(baseForm.getReportOutputFileName()) ? N_A : baseForm.getReportOutputFileName());
			jsonObject.addProperty("status", isBlank(baseForm.getStatus()) ? N_A : baseForm.getStatus());
			jsonObject.addProperty("bpaApplicationNumber", isBlank(baseForm.getBpaApplicationNumber()) ? N_A : baseForm.getBpaApplicationNumber());
			jsonObject.addProperty("permitNumber", isBlank(baseForm.getPermitNumber()) ? N_A : baseForm.getPermitNumber());
			jsonObject.addProperty("buildingLicenceeType", isBlank(baseForm.getBuildingLicenceeType()) ? N_A : baseForm.getBuildingLicenceeType());
			jsonObject.addProperty("buildingLicenceeName", isBlank(baseForm.getBuildingLicenceeName()) ? N_A : baseForm.getBuildingLicenceeName());
			jsonObject.addProperty("applicantName", isBlank(baseForm.getApplicantName()) ? N_A : baseForm.getApplicantName());
			jsonObject.addProperty("uploadedDateAndTime", DateUtils.toDefaultDateTimeFormat(baseForm.getUploadedDateAndTime()));
			planScrutinyReportData.add(jsonObject);
		});
		return enhance(planScrutinyReportData, planScrutinyReportResponse);
	}
}