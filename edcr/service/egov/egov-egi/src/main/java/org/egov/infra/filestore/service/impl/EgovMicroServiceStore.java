/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.infra.filestore.service.impl;

import static java.io.File.separator;
import static org.egov.infra.config.core.ApplicationThreadLocals.getCityCode;
import static org.egov.infra.utils.StringUtils.normalizeString;
import static org.slf4j.LoggerFactory.getLogger;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.math.RandomUtils;
import org.apache.commons.lang3.StringUtils;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.filestore.entity.FileStoreMapper;
import org.egov.infra.filestore.service.FileStoreService;
import org.egov.infra.microservice.contract.StorageResponse;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RequestCallback;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component("egovMicroServiceStore")
public class EgovMicroServiceStore implements FileStoreService {

    private static final String FILESTORE_V1_FILES = "filestore/v1/files";

    private static final Logger LOG = getLogger(LocalDiskFileStoreService.class);

    private String url;

    private RestTemplate restTemplate;

    @Autowired
    public EgovMicroServiceStore(@Value("${ms.url}") String url) {
        this.restTemplate = new RestTemplate();
        this.url = url + FILESTORE_V1_FILES;
    }

    @Override
    public FileStoreMapper store(File sourceFile, String fileName, String mimeType, String moduleName) {
        return store(sourceFile, fileName, mimeType, moduleName, true);
    }

    @Override
    public FileStoreMapper store(InputStream sourceFileStream, String fileName, String mimeType, String moduleName) {
        return store(sourceFileStream, fileName, mimeType, moduleName, true);
    }
    
    @Override
	public FileStoreMapper store(InputStream fileStream, String fileName, String mimeType, String moduleName, String tenantId) {
    	return store(fileStream, fileName, mimeType, moduleName, tenantId, true);
	}

    @Override
    public FileStoreMapper store(File file, String fileName, String mimeType, String moduleName, boolean deleteFile) {
        try {
            fileName = normalizeString(fileName);
            mimeType = normalizeString(mimeType);
            moduleName = normalizeString(moduleName);
            HttpHeaders headers = new HttpHeaders();
            if (LOG.isDebugEnabled())
                LOG.debug(String.format("Uploaded file   %s   with size  %s ", file.getName(), file.length()));

            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String, Object> map = new LinkedMultiValueMap<String, Object>();
            map.add("file", new FileSystemResource(file.getName()));
            map.add("tenantId", ApplicationThreadLocals.getTenantID());
            map.add("module", moduleName);
            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<MultiValueMap<String, Object>>(map,
                    headers);
            ResponseEntity<StorageResponse> result = restTemplate.postForEntity(url, request, StorageResponse.class);
            FileStoreMapper fileMapper = new FileStoreMapper(result.getBody().getFiles().get(0).getFileStoreId(),
                    fileName);
            if (LOG.isDebugEnabled())
                LOG.debug(
                        String.format("Uploaded file   %s   with filestoreid  %s ", file.getName(), fileMapper.getFileStoreId()));

            fileMapper.setContentType(mimeType);

            Files.deleteIfExists(Paths.get(fileName));

            return fileMapper;
        } catch (RestClientException e) {
            LOG.error("Error while Saving to FileStore", e);

        } catch (IOException e) {
            LOG.error("Error while Deleting temp file", e);
        }
        return null;
    }

    @Override
    public FileStoreMapper store(InputStream fileStream, String fileName, String mimeType, String moduleName,
            boolean closeStream) {

        try {
            HttpHeaders headers = new HttpHeaders();
            fileName = normalizeString(fileName);
            mimeType = normalizeString(mimeType);
            moduleName = normalizeString(moduleName);
            File f = new File(fileName);
            FileUtils.copyToFile(fileStream, f);
            if (closeStream) {
                fileStream.close();
            }
            if (LOG.isDebugEnabled())
                LOG.debug(String.format("Uploading .....  %s    with size %s   ", f.getName(), f.length()));

            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String, Object> map = new LinkedMultiValueMap<String, Object>();
            map.add("file", new FileSystemResource(f.getName()));
            map.add("tenantId", ApplicationThreadLocals.getTenantID());
            map.add("module", moduleName);
            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<MultiValueMap<String, Object>>(map,
                    headers);
            ResponseEntity<StorageResponse> result = restTemplate.postForEntity(url, request, StorageResponse.class);
            FileStoreMapper fileMapper = new FileStoreMapper(result.getBody().getFiles().get(0).getFileStoreId(),
                    fileName);
            if (LOG.isDebugEnabled())
                LOG.debug(String.format("Upload completed for  %s   with filestoreid   ", f.getName(),
                        fileMapper.getFileStoreId()));

            fileMapper.setContentType(mimeType);
            if (closeStream)
                Files.deleteIfExists(Paths.get(fileName));

            return fileMapper;
        } catch (RestClientException | IOException e) {
            LOG.error("Error while Saving to FileStore", e);

        }
        return null;

    }
    
    @Override
    public FileStoreMapper store(InputStream fileStream, String fileName, String mimeType, String moduleName,
            String tenantId, boolean closeStream) {

        try {
            HttpHeaders headers = new HttpHeaders();
            fileName = normalizeString(fileName);
            mimeType = normalizeString(mimeType);
            moduleName = normalizeString(moduleName);
            File f = new File(fileName);
            FileUtils.copyToFile(fileStream, f);
            if (closeStream) {
                fileStream.close();
            }
            if (LOG.isDebugEnabled())
                LOG.debug(String.format("Uploading .....  %s    with size %s   ", f.getName(), f.length()));

            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String, Object> map = new LinkedMultiValueMap<String, Object>();
            map.add("file", new FileSystemResource(f.getName()));
            map.add("tenantId", StringUtils.isEmpty(tenantId) ? ApplicationThreadLocals.getTenantID() : tenantId);
            map.add("module", moduleName);
            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<MultiValueMap<String, Object>>(map,
                    headers);
            ResponseEntity<StorageResponse> result = restTemplate.postForEntity(url, request, StorageResponse.class);
            FileStoreMapper fileMapper = new FileStoreMapper(result.getBody().getFiles().get(0).getFileStoreId(),
                    fileName);
            if (LOG.isDebugEnabled())
                LOG.debug(String.format("Upload completed for  %s   with filestoreid   ", f.getName(),
                        fileMapper.getFileStoreId()));

            fileMapper.setContentType(mimeType);
            if (closeStream)
                Files.deleteIfExists(Paths.get(fileName));

            return fileMapper;
        } catch (RestClientException | IOException e) {
            LOG.error("Error while Saving to FileStore", e);

        }
        return null;

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

        fileStoreId = normalizeString(fileStoreId);
        moduleName = normalizeString(moduleName);
        String urls = url + "/id?tenantId=" + ApplicationThreadLocals.getTenantID() + "&fileStoreId=" + fileStoreId;
        if (LOG.isDebugEnabled())
            LOG.debug(String.format("fetch file fron url   %s   ", urls));

        RequestCallback requestCallback = request -> request.getHeaders()
                .setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM, MediaType.ALL));
        Path path = Paths.get("/tmp/" + RandomUtils.nextLong());
        ResponseExtractor<Void> responseExtractor = response -> {
            Files.copy(response.getBody(), path);
            return null;
        };
        restTemplate.execute(URI.create(urls), HttpMethod.GET, requestCallback, responseExtractor);

        LOG.debug("fetch completed....   ");
        return path.toFile();

    }

    @Override
    public Path fetchAsPath(String fileStoreId, String moduleName) {
        return Paths.get(fetch(fileStoreId, moduleName).getPath());

    }

    @Override
    public void delete(String fileStoreId, String moduleName) {
        Path fileDirPath = this.getFileDirectoryPath(moduleName);
        if (!fileDirPath.toFile().exists()) {
            Path filePath = this.getFilePath(fileDirPath, fileStoreId);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                LOG.error(String.format("Could not remove document %s", filePath.getFileName()), e);
            }
        }
    }

    private Path getFileDirectoryPath(String moduleName) {
        return Paths.get(new StringBuilder().append(this.url).append(separator).append(getCityCode()).append(separator)
                .append(moduleName).toString());
    }

    private Path getFilePath(Path fileDirPath, String fileStoreId) {
        return Paths.get(fileDirPath + separator + fileStoreId);
    }

	@Override
	public File fetch(String fileStoreId, String moduleName, String tenantId) {
        fileStoreId = normalizeString(fileStoreId);
        moduleName = normalizeString(moduleName);
        String tenant = StringUtils.isEmpty(tenantId) ? ApplicationThreadLocals.getTenantID() : tenantId;
        String urls = url + "/id?tenantId=" + tenant + "&fileStoreId=" + fileStoreId;
        if (LOG.isDebugEnabled())
            LOG.debug(String.format("fetch file fron url   %s   ", urls));

        RequestCallback requestCallback = request -> request.getHeaders()
                .setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM, MediaType.ALL));
        Path path = Paths.get("/tmp/" + RandomUtils.nextLong());
        ResponseExtractor<Void> responseExtractor = response -> {
            Files.copy(response.getBody(), path);
            return null;
        };
        restTemplate.execute(URI.create(urls), HttpMethod.GET, requestCallback, responseExtractor);

        LOG.debug("fetch completed....   ");
        return path.toFile();
	}
}