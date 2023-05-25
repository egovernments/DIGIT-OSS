package org.egov.chat.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.junit.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;

@Slf4j
public class FileStoreTest {


    @Test
    public void test() throws IOException {

//        FileStore fileStore = new FileStore();
//
//        fileStore.downloadAndStore("http://www.pdf995.com/samples/pdf.pdf",
//            "pb.amritsar", "rainmaker-pgr");
//
//        File tempFile = fileStore.getFileAt("http://www.pdf995.com/samples/pdf.pdf");
//
//        File file = new File(FileStoreTest.class.getClassLoader() + "/tmp/qwe/asd.pdf");
//
//        log.info(tempFile.getAbsolutePath());
//
//        tempFile.delete();
    }


    @Test
    public void fileBase64TransformTest() throws IOException {

//        String filename = "/home/rushang/Downloads/Sandbox user guide.pdf";
//        File file = new File(filename);

//        FileInputStream fileInputStream = new FileInputStream(file);
//
//        File f2 = new File(filename + ".enc");
//        FileOutputStream fileOutputStream = new FileOutputStream(f2);
//        OutputStream outputStream = Base64.getEncoder().wrap(fileOutputStream);
//
//        int _byte;
//        while ((_byte = fileInputStream.read()) != -1)
//        {
//            outputStream.write(_byte);
//        }
//
//        outputStream.close();

//        String asd = new String(Base64.getEncoder().encode(FileUtils.readFileToByteArray(file)));
//
//        System.out.println(asd.length());

//        FileInputStream fileInputStream1 = new FileInputStream(f2);

//        String string = new String( FileUtils.readFileToByteArray(f2) );
//
//        System.out.println(string.length());

//        f2.delete();

    }

    @Test
    public void readEncodedFile() throws IOException {
//        String filename = "/home/rushang/Downloads/Sandbox user guide.pdf.enc";
//
//        System.out.println(FileUtils.sizeOf(new File(filename)));

    }


    HttpHeaders getDefaultHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authentication", "Bearer s6iyrz5y8rPApBQ2gQ3oog==");
        return headers;
    }

    @Test
    public void testFilename() {
        String fileURL = "https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/chatbot/July/22/1563780014746chatbot8753939779645334441.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190722T084923Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190722%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=47995ad12fbd041b2b6107ecc071250e7555de63cb16637146852671d8c74118";
        String filename = FilenameUtils.getName(fileURL);
        filename = filename.substring(13, filename.indexOf("?"));
        System.out.println(filename);
    }

}