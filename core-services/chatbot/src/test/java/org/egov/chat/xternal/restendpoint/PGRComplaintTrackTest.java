package org.egov.chat.xternal.restendpoint;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriTemplate;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.Assert.*;

@Slf4j
public class PGRComplaintTrackTest {

    private ObjectMapper objectMapper;

    @Before
    public void init() {
        objectMapper = new ObjectMapper(new JsonFactory());
    }

    @Test
    public void testDate() {
        String message = "";

        String pattern = "dd/MM/yyyy";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

        Date createdDate = new Date(1559414278168L);

        String date = simpleDateFormat.format(createdDate);
        System.out.println(date);


        log.info(date.toString());
    }

    @Test
    public void testURI() throws UnsupportedEncodingException {
        String url = "http://{enpointUrl}?method=logout&session={sessionId}";
        URI expanded = new UriTemplate(url).expand("asd.com/asd", "30/06"); // this is what RestTemplate uses
        url = URLDecoder.decode(expanded.toString(), "UTF-8"); // java.net class
        log.debug(url);


    }

    @Test
    public void testJsonpathLength() {
        DocumentContext documentContext = JsonPath.parse("{\"ResponseInfo\":{\"apiId\":null,\"ver\":null,\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":null,\"status\":\"successful\"},\"services\":[{\"citizen\":{\"id\":24005,\"uuid\":\"81528b1a-5795-43a7-a6e2-8c64ff145c3d\",\"name\":\"Rushang Dhanesha\",\"permanentAddress\":null,\"mobileNumber\":\"\",\"aadhaarNumber\":null,\"pan\":null,\"emailId\":\"\",\"userName\":\"\",\"password\":null,\"active\":true,\"type\":\"CITIZEN\",\"gender\":null,\"tenantId\":\"pb\",\"roles\":[{\"name\":\"Citizen\",\"code\":\"CITIZEN\",\"tenantId\":\"pb\"}]},\"tenantId\":\"pb.amritsar\",\"serviceCode\":\"WaterLoggedRoad\",\"serviceRequestId\":\"17/06/2019/001747\",\"addressId\":\"0e87d3f6-ef25-4f2b-a28f-df54ead56e37\",\"accountId\":\"24005\",\"phone\":\"\",\"addressDetail\":{\"uuid\":\"0e87d3f6-ef25-4f2b-a28f-df54ead56e37\",\"mohalla\":\"SUN02\",\"locality\":\"Aggarsain Chowk to Mal Godown - Both Sides\",\"city\":\"pb.amritsar\",\"tenantId\":\"pb.amritsar\"},\"active\":true,\"status\":\"open\",\"source\":\"web\",\"auditDetails\":{\"createdBy\":\"24005\",\"lastModifiedBy\":\"24005\",\"createdTime\":1560770037585,\"lastModifiedTime\":1560770037585}},{\"citizen\":{\"id\":24005,\"uuid\":\"81528b1a-5795-43a7-a6e2-8c64ff145c3d\",\"name\":\"Rushang Dhanesha\",\"permanentAddress\":null,\"mobileNumber\":\"\",\"aadhaarNumber\":null,\"pan\":null,\"emailId\":\"\",\"userName\":\"\",\"password\":null,\"active\":true,\"type\":\"CITIZEN\",\"gender\":null,\"tenantId\":\"pb\",\"roles\":[{\"name\":\"Citizen\",\"code\":\"CITIZEN\",\"tenantId\":\"pb\"}]},\"tenantId\":\"pb.amritsar\",\"serviceCode\":\"StreetLightNotWorking\",\"serviceRequestId\":\"14/06/2019/001746\",\"addressId\":\"566ee7b3-4be8-4e80-8c0e-b4f9a8bab3e4\",\"accountId\":\"24005\",\"phone\":\"\",\"addressDetail\":{\"uuid\":\"566ee7b3-4be8-4e80-8c0e-b4f9a8bab3e4\",\"mohalla\":\"SUN150\",\"locality\":\"Mohalla Rajan Wala (both sides)\",\"city\":\"pb.amritsar\",\"latitude\":12.928934,\"longitude\":77.6279297,\"tenantId\":\"pb.amritsar\"},\"active\":true,\"status\":\"open\",\"source\":\"web\",\"auditDetails\":{\"createdBy\":\"24005\",\"lastModifiedBy\":\"24005\",\"createdTime\":1560508311350,\"lastModifiedTime\":1560508311350}},{\"citizen\":{\"id\":24005,\"uuid\":\"81528b1a-5795-43a7-a6e2-8c64ff145c3d\",\"name\":\"Rushang Dhanesha\",\"permanentAddress\":null,\"mobileNumber\":\"\",\"aadhaarNumber\":null,\"pan\":null,\"emailId\":\"\",\"userName\":\"\",\"password\":null,\"active\":true,\"type\":\"CITIZEN\",\"gender\":null,\"tenantId\":\"pb\",\"roles\":[{\"name\":\"Citizen\",\"code\":\"CITIZEN\",\"tenantId\":\"pb\"}]},\"tenantId\":\"pb.amritsar\",\"serviceCode\":\"StreetLightNotWorking\",\"serviceRequestId\":\"14/06/2019/001745\",\"addressId\":\"dbcd6b9d-4fd3-4227-ad5c-bb791bcafa45\",\"accountId\":\"24005\",\"phone\":\"\",\"addressDetail\":{\"uuid\":\"dbcd6b9d-4fd3-4227-ad5c-bb791bcafa45\",\"mohalla\":\"SUN04\",\"locality\":\"Ajit Nagar\",\"city\":\"pb.amritsar\",\"latitude\":31.638524,\"longitude\":74.875153,\"tenantId\":\"pb.amritsar\"},\"active\":true,\"status\":\"open\",\"source\":\"web\",\"auditDetails\":{\"createdBy\":\"24005\",\"lastModifiedBy\":\"24005\",\"createdTime\":1560507917986,\"lastModifiedTime\":1560507917986}},{\"citizen\":{\"id\":24005,\"uuid\":\"81528b1a-5795-43a7-a6e2-8c64ff145c3d\",\"name\":\"Rushang Dhanesha\",\"permanentAddress\":null,\"mobileNumber\":\"9428010077\",\"aadhaarNumber\":null,\"pan\":null,\"emailId\":\"\",\"userName\":\"9428010077\",\"password\":null,\"active\":true,\"type\":\"CITIZEN\",\"gender\":null,\"tenantId\":\"pb\",\"roles\":[{\"name\":\"Citizen\",\"code\":\"CITIZEN\",\"tenantId\":\"pb\"}]},\"tenantId\":\"pb.amritsar\",\"serviceCode\":\"StreetLightNotWorking\",\"serviceRequestId\":\"14/06/2019/001744\",\"addressId\":\"1f1a7a16-7544-453f-8153-a6c701af425e\",\"accountId\":\"24005\",\"phone\":\"9428010077\",\"addressDetail\":{\"uuid\":\"1f1a7a16-7544-453f-8153-a6c701af425e\",\"mohalla\":\"SUN04\",\"locality\":\"Ajit Nagar\",\"city\":\"pb.amritsar\",\"tenantId\":\"pb.amritsar\"},\"active\":true,\"status\":\"open\",\"source\":\"web\",\"auditDetails\":{\"createdBy\":\"24005\",\"lastModifiedBy\":\"24005\",\"createdTime\":1560507497697,\"lastModifiedTime\":1560507497697}},{\"citizen\":{\"id\":24005,\"uuid\":\"81528b1a-5795-43a7-a6e2-8c64ff145c3d\",\"name\":\"Rushang Dhanesha\",\"permanentAddress\":null,\"mobileNumber\":\"9428010077\",\"aadhaarNumber\":null,\"pan\":null,\"emailId\":\"\",\"userName\":\"9428010077\",\"password\":null,\"active\":true,\"type\":\"CITIZEN\",\"gender\":null,\"tenantId\":\"pb\",\"roles\":[{\"name\":\"Citizen\",\"code\":\"CITIZEN\",\"tenantId\":\"pb\"}]},\"tenantId\":\"pb.amritsar\",\"serviceCode\":\"NoWaterSupply\",\"serviceRequestId\":\"14/06/2019/001743\",\"addressId\":\"85e1995c-4042-41a2-b8a1-2dbf28ae476a\",\"address\":\"Modella Woolen Mills Building, M.M Malviya Rd, INA Colony, Amritsar, Punjab 143001, India\",\"accountId\":\"24005\",\"phone\":\"9428010077\",\"addressDetail\":{\"uuid\":\"85e1995c-4042-41a2-b8a1-2dbf28ae476a\",\"mohalla\":\"SUN02\",\"locality\":\"Aggarsain Chowk to Mal Godown - Both Sides\",\"city\":\"pb.amritsar\",\"latitude\":31.638524,\"longitude\":74.875153,\"tenantId\":\"pb.amritsar\"},\"active\":true,\"status\":\"open\",\"source\":\"web\",\"auditDetails\":{\"createdBy\":\"24005\",\"lastModifiedBy\":\"24005\",\"createdTime\":1560506373245,\"lastModifiedTime\":1560506373245}}],\"actionHistory\":[{\"actions\":[{\"uuid\":\"da54bebf-6a92-4287-bc80-95f61c6bf886\",\"tenantId\":\"pb.amritsar\",\"by\":\"24005:Citizen\",\"when\":1560770037585,\"businessKey\":\"17/06/2019/001747\",\"action\":\"open\",\"status\":\"open\",\"media\":[\"https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/rainmaker-pgr/June/17/1560770006006dummy.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190618T071129Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAJLBRPPEUXFAI3Z6Q%2F20190618%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=f4793568fa6ade529b37cd6eaf9b011da025da1d597c761ebc9acd3c8b159ff1,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/rainmaker-pgr/June/17/1560770006006dummy_large.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190618T071129Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAJLBRPPEUXFAI3Z6Q%2F20190618%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=6b7a7360984643f462d76f84b0b00750fe235cce67d4020b876bfbdbdf797082,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/rainmaker-pgr/June/17/1560770006006dummy_medium.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190618T071129Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAJLBRPPEUXFAI3Z6Q%2F20190618%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=5b338b5759e436866dd0ee8753fc4d9d2059512306f07678ef66cc4404611f5c,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/rainmaker-pgr/June/17/1560770006006dummy_small.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190618T071129Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAJLBRPPEUXFAI3Z6Q%2F20190618%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=2138e43c1bc2441932adcbab2ab57f54b39be3cfb6ac409d7e97bc46c3e3b3aa\"]}]},{\"actions\":[{\"uuid\":\"a633c6e2-f808-4628-a72e-2f34303f1737\",\"tenantId\":\"pb.amritsar\",\"by\":\"24005:Citizen\",\"when\":1560508311350,\"businessKey\":\"14/06/2019/001746\",\"action\":\"open\",\"status\":\"open\",\"media\":[]}]},{\"actions\":[{\"uuid\":\"558136fb-3c37-4bba-89e3-3e7c3d57cfcd\",\"tenantId\":\"pb.amritsar\",\"by\":\"24005:Citizen\",\"when\":1560507917986,\"businessKey\":\"14/06/2019/001745\",\"action\":\"open\",\"status\":\"open\",\"media\":[]}]},{\"actions\":[{\"uuid\":\"a6be5a00-c127-4daa-a468-5f38ed836274\",\"tenantId\":\"pb.amritsar\",\"by\":\"24005:Citizen\",\"when\":1560507497697,\"businessKey\":\"14/06/2019/001744\",\"action\":\"open\",\"status\":\"open\",\"media\":[]}]},{\"actions\":[{\"uuid\":\"fb53a939-696c-431d-b70b-616290b32fc3\",\"tenantId\":\"pb.amritsar\",\"by\":\"24005:Citizen\",\"when\":1560506373245,\"businessKey\":\"14/06/2019/001743\",\"action\":\"open\",\"status\":\"open\",\"media\":[]}]}]}");

        Integer numberOfServices = (Integer) ( (JSONArray) documentContext.read("$..services.length()")) .get(0);

        String message = "";

        if(numberOfServices == 1) {
            message += "Complaint Details :";
            message += "\nCategory : " + documentContext.read("$.services.[0].serviceCode");
            Date createdDate = new Date((long) documentContext.read("$.services.[0].auditDetails.createdTime"));
            message += "\nFiled Date : " + getDateFromTimestamp(createdDate);
            message += "\nCurrent Status : " + documentContext.read("$.services.[0].status");
        } else if(numberOfServices > 1) {
            message += "Complaint Details :";
            for (int i = 0; i < numberOfServices; i++) {
                message += "\n" + (i + 1) + ".";
                message += "\nCategory : " + documentContext.read("$.services.[" + i + "].serviceCode");
                Date createdDate = new Date((long) documentContext.read("$.services.[" + i + "].auditDetails.createdTime"));
                message += "\nFiled Date : " + getDateFromTimestamp(createdDate);
                message += "\nCurrent Status : " + documentContext.read("$.services.[" + i + "].status");
            }
        } else {
            message += "No complaints to display";
        }

        log.info(message);
    }

    private String getDateFromTimestamp(Date createdDate) {
        String pattern = "dd/MM/yyyy";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        return simpleDateFormat.format(createdDate);
    }

}