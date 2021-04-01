package org.egov.test;

import org.egov.dataupload.model.Document;
import org.egov.dataupload.service.ExcelIO;
import org.egov.dataupload.service.FileIO;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.io.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static junit.framework.TestCase.assertTrue;
@Ignore
public class ExcelIOTest {

    private FileIO excelIO;
    private Document document;

    @Before
    public void setUp() {
        excelIO = new ExcelIO();

        List<String> headers = Arrays.asList("Code", "Value");
        List<List<Object>> rows = Collections.singletonList(Arrays.asList("IN", "INDIA"));
        document = new Document(headers, rows);
    }

    @Test
    public void read() throws IOException {
        InputStream stream = new FileInputStream
                ("C:\\Users\\Nithin\\Documents\\eGov\\egov-services\\core\\egov-data-uploader\\src\\main\\resources" +
                        "\\Employee_Create.xlsx");
        Document document = excelIO.read(stream);
        assertTrue(document.getHeaders().size() == 11);
        assertTrue(document.getRows().size() == 2);
    }

    @Test
    public void write() throws IOException {
        File outputFile = new File("C:\\Users\\Nithin\\Documents\\eGov\\egov-services\\core\\egov-data-uploader\\src" +
                "\\main\\resources\\output\\Test.xlsx");
        if(outputFile.createNewFile()) {
            OutputStream stream = new FileOutputStream(outputFile);
            excelIO.write(stream, document);
        }
    }
}
