package org.egov.egf.web.adaptor;

import java.lang.reflect.Type;

import org.egov.model.report.ChartOfAccountsReport;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class ChartOfAccountReportJsonAdaptor implements JsonSerializer<ChartOfAccountsReport> {
    
    @Override
    public JsonElement serialize(final ChartOfAccountsReport coaresult, final Type typeOfSrc,
            final JsonSerializationContext context) {
        final JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("accountcode", coaresult.getAccountCode());
        jsonObject.addProperty("accountname", coaresult.getAccountName());
        jsonObject.addProperty("majorcode", coaresult.getMajorCode());
        jsonObject.addProperty("majorName", coaresult.getMajorName());
        jsonObject.addProperty("minorcode", coaresult.getMinorCode());
        jsonObject.addProperty("minorname", coaresult.getMinorName());

        jsonObject.addProperty("type", coaresult.getType());
        jsonObject.addProperty("purpose", coaresult.getPurpose());

        jsonObject.addProperty("isActiveForPosting", coaresult.getIsActiveForPosting());

        jsonObject.addProperty("accountdetailtype", coaresult.getAccountDetailType());

        return jsonObject;
    }

}
