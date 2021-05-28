package org.egov.infra.filestore.service.impl;

import static java.io.File.separator;
import static java.util.UUID.randomUUID;
import static org.apache.commons.io.FileUtils.getUserDirectoryPath;
import static org.egov.infra.config.core.ApplicationThreadLocals.getCityCode;
import static org.slf4j.LoggerFactory.getLogger;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.fileupload.disk.DiskFileItem;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.filestore.entity.FileStoreMapper;
import org.egov.infra.filestore.service.FileStoreService;
import org.egov.infra.microservice.models.FileReq;
import org.egov.infra.microservice.models.StorageResponse;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

@Component("microDiskFileStoreService")
public class MicroDiskFileStoreService implements FileStoreService {

    private static final Logger LOG = getLogger(MicroDiskFileStoreService.class);
    private static final String FILE_STORE_ERROR = "Error occurred while storing files at %s/%s/%s";

    private String fileStoreBaseDir;
    @Autowired
    private MicroserviceUtils microserviceUtils;

    @Autowired
    public MicroDiskFileStoreService(@Value("${filestore.base.dir}") String fileStoreBaseDir) {
        if (fileStoreBaseDir.isEmpty())
            this.fileStoreBaseDir = getUserDirectoryPath() + separator + "egovfilestore";
        else
            this.fileStoreBaseDir = fileStoreBaseDir;
    }

    @Override
    public FileStoreMapper store(File sourceFile, String fileName, String mimeType, String moduleName) {
        return store(sourceFile, fileName, mimeType, moduleName, true);
    }

    public FileStoreMapper store(List<MultipartFile> files, String fileName, String mimeType, String moduleName) {
        return storeFiles(files, fileName, mimeType, moduleName, true);
    }

    public FileStoreMapper storeFiles(List<MultipartFile> files, InputStream sourceFileStream, String fileName,
            String mimeType, String moduleName) {
        return storeFiles(files, sourceFileStream, fileName, mimeType, moduleName, true);
    }

    @Override
    public FileStoreMapper store(InputStream sourceFileStream, String fileName, String mimeType, String moduleName) {
        return store(sourceFileStream, fileName, mimeType, moduleName, true);
    }

    @Override
    public FileStoreMapper store(byte[] fileBytes, String fileName, String mimeType, String moduleName) {
        try {
            FileStoreMapper fileMapper = new FileStoreMapper(randomUUID().toString(), fileName);
            fileMapper.setContentType(mimeType);
            Path newFilePath = this.createNewFilePath(fileMapper, moduleName);
            Files.write(newFilePath, fileBytes);
            return fileMapper;
        } catch (IOException e) {
            throw new ApplicationRuntimeException(
                    String.format(FILE_STORE_ERROR, fileStoreBaseDir, getCityCode(), moduleName), e);
        }
    }

    public FileStoreMapper storeFiles(List<MultipartFile> files, InputStream fileStream, String fileName,
            String mimeType, String moduleName, boolean closeStream) {
        try {
            StorageResponse storageRes = microserviceUtils.getFileStorageService(files, moduleName);
            FileStoreMapper fileMapper = null;
            List<FileReq> filesList = storageRes.getFiles();
            for (FileReq filesId : filesList) {
                fileMapper = new FileStoreMapper(filesId.getFileStoreId(), fileName);
                fileMapper.setContentType(mimeType);
            }

            return fileMapper;
        } catch (IOException e) {
            throw new ApplicationRuntimeException(String.format(FILE_STORE_ERROR, getCityCode(), moduleName), e);
        }

    }

    @Override
    public FileStoreMapper store(File file, String fileName, String mimeType, String moduleName, boolean deleteFile) {
        try {
            String probeContentType = mimeType;
            String name = fileName;
            int length = (int) file.length();
            File parentFile = file.getParentFile();
    
            DiskFileItem fileItem = new DiskFileItem("files",probeContentType, false, name, length, parentFile);
            InputStream inputs =  new FileInputStream(file);
            OutputStream os = fileItem.getOutputStream();
            int ret = inputs.read();
            while ( ret != -1 )
            {
                os.write(ret);
                ret = inputs.read();
            }
            os.flush();
            MultipartFile multipartFile = new CommonsMultipartFile(fileItem);
            FileStoreMapper fileStoreMapper = storeFiles(Arrays.asList(multipartFile),
                    name,
                    mimeType, moduleName,false);
            return fileStoreMapper;
        } catch (IOException e) {
            throw new ApplicationRuntimeException(
                    String.format(FILE_STORE_ERROR, this.fileStoreBaseDir, getCityCode(), moduleName), e);
        }
    }

    public FileStoreMapper storeFiles(List<MultipartFile> files, String fileName, String mimeType, String moduleName,
            boolean deleteFile) {
        try {
            StorageResponse storageRes = microserviceUtils.getFileStorageService(files, moduleName);
            FileStoreMapper fileMapper = null;
            List<FileReq> filesList = new ArrayList<FileReq>();
            if (storageRes.getFiles() != null && !storageRes.getFiles().isEmpty())
                filesList = storageRes.getFiles();
            if (!filesList.isEmpty() && filesList != null)
                for (FileReq filesId : filesList) {
                    fileMapper = new FileStoreMapper(filesId.getFileStoreId(), fileName);
                    fileMapper.setContentType(mimeType);
                }
            return fileMapper;
        } catch (IOException e) {
            throw new ApplicationRuntimeException(String.format(FILE_STORE_ERROR, getCityCode(), moduleName), e);
        }
    }

    @Override
    public FileStoreMapper store(InputStream fileStream, String fileName, String mimeType, String moduleName,
            boolean closeStream) {
        try {          
            byte[] fileSize = fileName.getBytes();
            DiskFileItem fileItem = new DiskFileItem("file",mimeType, false, fileName, fileSize.length, null);
            OutputStream os = fileItem.getOutputStream();
            int ret = fileStream.read();
            while ( ret != -1 )
            {
                os.write(ret);
                ret = fileStream.read();
            }
            os.flush();
            MultipartFile multipartFile = new CommonsMultipartFile(fileItem);
            FileStoreMapper fileStoreMapper = storeFiles(Arrays.asList(multipartFile),
                    fileName,
                    mimeType, moduleName,false);
            
            return fileStoreMapper;
        } catch (IOException e) {
            throw new ApplicationRuntimeException(
                    String.format(FILE_STORE_ERROR, this.fileStoreBaseDir, getCityCode(), moduleName), e);
        }
    }

    @Override
    public File fetch(FileStoreMapper fileMapper, String moduleName) {
        return this.fetch(fileMapper.getFileStoreId(), moduleName);
    }

    @Override
    public Set<File> fetchAll(Set<FileStoreMapper> fileMappers, String moduleName) {
        return fileMappers.stream().map(fileMapper -> this.fetch(fileMapper.getFileStoreId(), moduleName))
                .collect(Collectors.toSet());
    }

    @Override
    public File fetch(String fileStoreId, String moduleName) {
        return fetchAsPath(fileStoreId, moduleName).toFile();
    }

    public File fetchFromDigitFileStoreApi(String fileStoreId) throws IOException {
        return fetchDigitFilestore(fileStoreId);
    }
    
    @Override
    public File fetchNFS(String fileStoreId, String moduleName) {
        return fetchAsPathNFS(fileStoreId, moduleName).toFile();
    }

    @Override
    public Path fetchAsPath(String fileStoreId, String moduleName) {
//        Path fileDirPath = this.getFileDirectoryPath(moduleName);
//        if (!fileDirPath.toFile().exists())
//            throw new ApplicationRuntimeException(String.format("File Store does not exist at Path : %s/%s/%s",
//                    this.fileStoreBaseDir, getCityCode(), moduleName));
        return this.fetchAsDigitPath(fileStoreId,moduleName);
    }

    public Path fetchAsDigitPath(String fileStoreId,String moduleName) {
        ResponseEntity<byte[]> responseEntity = microserviceUtils.fetchFilesFromDigitService(fileStoreId);
        Path fileDirPath = Paths.get(fileStoreId);
        Path path = null;
        try {
            path = Files.write(fileDirPath, responseEntity.getBody());
        } catch (IOException e) {
            LOG.error("error occured while fetching path" + e.getMessage());
        }
        return path;

    }

    public File fetchDigitFilestore(String fileStoreId) throws IOException {
        ResponseEntity<byte[]> responseEntity = microserviceUtils.fetchFilesFromDigitService(fileStoreId);
        Path fileDirPath = this.getFileDirectoryPath("EGF");
        Path path = Files.write(Paths.get(fileDirPath + separator + fileStoreId), responseEntity.getBody());

        return path.toFile();
    }

    @Override
    public Path fetchAsPathNFS(String fileStoreId, String moduleName) {
       Path fileDirPath = this.getFileDirectoryPath(moduleName);
        if (!fileDirPath.toFile().exists())
            throw new ApplicationRuntimeException(String.format("File Store does not exist at Path : %s/%s/%s",
                   this.fileStoreBaseDir, getCityCode(), moduleName));
        return this.getFilePath(fileDirPath, fileStoreId);
    }

    @Override
    public void delete(String fileStoreId, String moduleName) {
        Path fileDirPath = this.getFileDirectoryPath(moduleName);
        if (!fileDirPath.toFile().exists()) {
            Path filePath = this.getFilePath(fileDirPath, fileStoreId);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new ApplicationRuntimeException(
                        String.format("Could not remove document %s", filePath.getFileName()), e);
            }
        }
    }

    private Path createNewFilePath(FileStoreMapper fileMapper, String moduleName) throws IOException {
        Path fileDirPath = this.getFileDirectoryPath(moduleName);
        if (!fileDirPath.toFile().exists()) {
            LOG.info("File Store Directory {}/{}/{} not found, creating one", this.fileStoreBaseDir, getCityCode(),
                    moduleName);
            Files.createDirectories(fileDirPath);
            LOG.info("Created File Store Directory {}/{}/{}", this.fileStoreBaseDir, getCityCode(), moduleName);
        }
        return this.getFilePath(fileDirPath, fileMapper.getFileStoreId());
    }

    private Path getFileDirectoryPath(String moduleName) {
        return Paths.get(new StringBuilder().append(this.fileStoreBaseDir).append(separator).append(getCityCode())
                .append(separator).append(moduleName).toString());
    }

    private Path getFilePath(Path fileDirPath, String fileStoreId) {
        return Paths.get(fileDirPath + separator + fileStoreId);
    }
}