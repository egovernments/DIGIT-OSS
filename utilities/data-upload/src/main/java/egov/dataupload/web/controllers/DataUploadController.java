package egov.dataupload.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import egov.dataupload.service.DataUploadService;
import egov.dataupload.utils.Utils;
import egov.dataupload.web.models.DataUploaderResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class DataUploadController {

    private DataUploadService dataUploadService;
    private ObjectMapper objectMapper;

    @Autowired
    public DataUploadController(DataUploadService dataUploadService, ObjectMapper objectMapper) {
        this.dataUploadService = dataUploadService;
        this.objectMapper = objectMapper;
    }

    @RequestMapping(value = "/{service}/{mapping}/_upload", method = RequestMethod.POST)
    public ResponseEntity<DataUploaderResponse> upload(@RequestParam("file") MultipartFile file,
                                                       @RequestParam("requestInfo") String requestInfo,
                                                       @PathVariable("service") String service,
                                                       @PathVariable("mapping") String mapping) {
        RequestInfo reqInfo = Utils.getRequestInfo(objectMapper, requestInfo);
        if(reqInfo == null || reqInfo.getUserInfo() == null)
            throw new CustomException("USER_INFO_MISSING", "Failed to process data upload, missing user info!");
        String fileStoreId = dataUploadService.upload(service, mapping, reqInfo.getUserInfo().getTenantId(), file, reqInfo);
        return new ResponseEntity<>(new DataUploaderResponse(fileStoreId), HttpStatus.OK);
    }
}
