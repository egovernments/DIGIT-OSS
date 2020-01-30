package org.egov.model.cheque;

import java.lang.reflect.Type;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class ChequeReportJsonAdaptor  implements JsonSerializer<ChequeReportModel>{
    DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
    int rowCount = 1;
    @Override
    public JsonElement serialize(final ChequeReportModel model, final Type typeOfSrc,
            final JsonSerializationContext context) {
        
        final JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("id", rowCount++);
        jsonObject.addProperty("bankBranch", model.getBankBranch());
        jsonObject.addProperty("bankAccountNumber", model.getBankAccountNumber());
        jsonObject.addProperty("chequeNumber", model.getChequeNumber());
        jsonObject.addProperty("chequeDate", dateFormat.format(model.getChequeDate()));
        jsonObject.addProperty("payTo", model.getPayTo());
        jsonObject.addProperty("voucherNumber", model.getVoucherNumber());
        jsonObject.addProperty("voucherHeaderId", model.getVoucherHeaderId());
        jsonObject.addProperty("voucherDate", dateFormat.format(model.getVoucherDate()));
        jsonObject.addProperty("surrenderReason", model.getSurrenderReason());
        return jsonObject;
    }
}
