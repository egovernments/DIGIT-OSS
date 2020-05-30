package egov.dataupload.web.controllers;

import egov.dataupload.service.DataUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class DataUploadController {

    private DataUploadService dataUploadService;

    @Autowired
    public DataUploadController(DataUploadService dataUploadService) {
        this.dataUploadService = dataUploadService;
    }

    @RequestMapping(value = "/{service}/{mapping}/_upload", method = RequestMethod.POST)
    public ResponseEntity<Void> upload(@RequestParam("file") MultipartFile file,
                                       @PathVariable("service") String service,
                                       @PathVariable("mapping") String mapping) {
        dataUploadService.upload(service, mapping, file);

        return new ResponseEntity<Void>(HttpStatus.OK);
    }

}
