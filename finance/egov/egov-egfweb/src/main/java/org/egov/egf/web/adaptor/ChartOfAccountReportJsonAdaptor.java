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
        if (coaresult.getPurpose() == null)
            jsonObject.addProperty("purpose", "");
        else
            jsonObject.addProperty("purpose", coaresult.getPurpose());

        if (coaresult.getIsActiveForPosting() == null)
            jsonObject.addProperty("isActiveForPosting", "");
        else
            jsonObject.addProperty("isActiveForPosting", coaresult.getIsActiveForPosting() ? "Yes" : "No");
        if (coaresult.getAccountDetailType() == null)
            jsonObject.addProperty("accountdetailtype", "");
        else
            jsonObject.addProperty("accountdetailtype", coaresult.getAccountDetailType());

        return jsonObject;
    }

}
