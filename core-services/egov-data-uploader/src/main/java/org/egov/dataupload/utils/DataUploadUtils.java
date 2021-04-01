package org.egov.dataupload.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.egov.dataupload.model.Definition;
import org.egov.dataupload.model.Document;
import org.egov.dataupload.model.UploadDefinition;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;


@Component
public class DataUploadUtils {
	
	private static final Logger logger = LoggerFactory.getLogger(DataUploadUtils.class);
	private DateFormat format = new SimpleDateFormat("dd/MM/YYYY");
	private DataFormatter dataFormatter = new DataFormatter();
	
	@Value("${internal.file.folder.path}")
	private String internalFolderPath;
	
	@Value("${business.module.host}")
	private String businessModuleHost;

	@Autowired
	private ObjectMapper objectMapper;

    public double getCellValueAsDouble(Cell cell) throws InvalidFormatException {

        if (cell.getCellTypeEnum() == CellType.NUMERIC)
        {
            return cell.getNumericCellValue();
        } else if (cell.getCellTypeEnum() == CellType.STRING) {
            return Double.parseDouble(cell.getStringCellValue());
        } else if (cell.getCellTypeEnum() == CellType.BLANK || cell.getCellTypeEnum() == CellType._NONE) {
            return 0;
        } else {
            throw new InvalidFormatException("Cannot read int from a " + cell.getCellTypeEnum().toString() + " field type");
        }
    }

    public String getCellValueAsString(Cell cell) throws InvalidFormatException {
        if (cell.getCellTypeEnum() == CellType.NUMERIC)
        {
            return Double.toString(cell.getNumericCellValue());
        } else if (cell.getCellTypeEnum() == CellType.STRING || cell.getCellTypeEnum() == CellType.FORMULA) {
            return cell.getStringCellValue();
        } else if (cell.getCellTypeEnum() == CellType.BOOLEAN) {
            return Boolean.toString(cell.getBooleanCellValue());
        } else if (cell.getCellTypeEnum() == CellType.BLANK || cell.getCellTypeEnum() == CellType._NONE) {
            return "";
        }
        else {
            throw new InvalidFormatException("Cannot read string from a " + cell.getCellTypeEnum().toString() + " field type");
        }
    }

    public Boolean getCellValueAsBoolean(Cell cell) throws InvalidFormatException {
        if (cell.getCellTypeEnum() == CellType.NUMERIC)
        {
            return cell.getNumericCellValue() != 0;
        } else if (cell.getCellTypeEnum() == CellType.STRING) {
            String val = cell.getStringCellValue().toLowerCase().trim();
            if (val.equals("true") || val.equals("yes") || val.equals("on")) {
                return true;
            } else if (val.equals("false") || val.equals("no") || val.equals("off") || val.isEmpty()) {
                return false;
            } else {
                throw new InvalidFormatException("Unsupported boolean value " + cell.getStringCellValue() + " field type");
            }
        } else if (cell.getCellTypeEnum() == CellType.BOOLEAN) {
            return cell.getBooleanCellValue();
        } else if (cell.getCellTypeEnum() == CellType.BLANK || cell.getCellTypeEnum() == CellType._NONE) {
            return false;
        } else {
            throw new InvalidFormatException("Cannot read bool from a " + cell.getCellTypeEnum().toString() + " field type");
        }
    }

    public String getCleanedName(String name) {
        return name.replaceAll("[^a-zA-Z0-9]","").toUpperCase();
    }

    public Map<String, Integer> getColumnIndexMap(Row firstRow) throws InvalidFormatException {
        Map<String, Integer> columnToIndex = new HashMap<>();

        for (int i=0; i < firstRow.getLastCellNum(); i++) {
            String columnName = getCellValueAsString(firstRow.getCell(i));
            if (columnName == null || columnName.isEmpty()) {
                continue;
            }
            columnName = getCleanedName(columnName);

            columnToIndex.put(columnName, i);
        }
        return columnToIndex;
    }

    public Document readExcelFile(InputStream stream) throws IOException, InvalidFormatException {
		try(Workbook wb = WorkbookFactory.create(stream)) {
            Sheet sheet = wb.getSheetAt(0);

            List<List<Object>> excelData = new ArrayList<>();
            List<String> columnHeaders = new ArrayList<>();

            int rowStart = sheet.getFirstRowNum();
            int rowEnd = sheet.getLastRowNum();
            int totalRows = 0;

            logger.info("Total number of rows:  " + sheet.getPhysicalNumberOfRows());

            for (int rowNum = rowStart; rowNum < (rowEnd + 1); rowNum++) {
                List<Object> dataList = new ArrayList<>();
                Row row = sheet.getRow(rowNum);
                if (null == row) {
                    continue;
                }
                int lastColumn = 0;
                if(rowNum == 0) {
                    totalRows = row.getLastCellNum();
                    lastColumn = totalRows;
                }else {
                    lastColumn = Math.max(totalRows, row.getLastCellNum());
                }
                for (int colNum = 0; colNum < lastColumn; colNum++) {
                    Cell cell = row.getCell(colNum, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL );
                    if(null == cell) {
                        dataList.add(null);
                    }else if(0 == cell.getRowIndex()) {
                        columnHeaders.add(cell.getStringCellValue());
                    }else {
                            switch (cell.getCellTypeEnum()) {
                                case NUMERIC:
                                    if (CellType.NUMERIC == cell.getCellTypeEnum()) {
                                        if (HSSFDateUtil.isCellDateFormatted(cell)) {
                                            dataList.add(cell.getDateCellValue().getTime());
                                        } else {
                                            dataList.add(dataFormatter.formatCellValue(cell));
                                        }
                                    }
                                    break;
                                case STRING:
                                    if (cell.getStringCellValue().equals("NA") ||
                                            cell.getStringCellValue().equals("N/A") || cell.getStringCellValue().equals("na")) {
                                        dataList.add(null);
                                    } else if (validateDate(cell.getStringCellValue())) {
                                        try {
                                            Date date = format.parse(cell.getStringCellValue());
                                            dataList.add(date.getTime());
                                        } catch (Exception e) {
                                            logger.info("Couldn't parse date", e);
                                            dataList.add(cell.getStringCellValue());
                                        }
                                    } else if (!cell.getStringCellValue().trim().isEmpty()) {
                                        logger.trace("string: " + cell.getStringCellValue());
                                        dataList.add(cell.getStringCellValue());
                                    } else {
                                        dataList.add(null);
                                    }
                                    break;
                                case BOOLEAN:
                                    dataList.add(cell.getBooleanCellValue());
                                    break;
                                case BLANK:
                                    dataList.add(null);
                                    break;

                            }
                    }
                }
                logger.info("dataList: " + dataList);

                if (!dataList.isEmpty()) {
                    excelData.add(dataList);
                }

            }

            return new Document(columnHeaders, excelData);

        } catch(IOException e){
            logger.error("Unable to open stream.", e);
            throw e;
        } catch (InvalidFormatException e) {
            logger.error("Invalid format found, not an excel file. ", e);
            throw e;
        }

	}


    private boolean validateDate(String date) {
        boolean isValid = false;
        String dateRegex = "([0-9]{2})\\\\([0-9]{2})\\\\([0-9]{4})";
        if(date.matches(dateRegex))
            isValid = true;

        return isValid;
    }

    private static boolean isCellEmpty(final Cell cell) {
        return cell == null ||
                cell.getCellTypeEnum() == CellType.BLANK ||
                cell.getCellTypeEnum() == CellType.STRING && cell.getStringCellValue().isEmpty();

    }

	public Definition getUploadDefinition(Map<String, UploadDefinition> searchDefinitionMap,
			String moduleName, String defName){
		logger.info("Fetching Definitions for module: "+moduleName+" and upload feature: "+defName);
		List<Definition> definitions = searchDefinitionMap.get(moduleName).getDefinitions().stream()
											.filter(def -> (def.getName().equals(defName)))
		                                 .collect(Collectors.toList());
		if(definitions.isEmpty()){
			logger.error("There's no Upload Definition provided for this upload feature");
			throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
					"There's no Upload Definition provided for this upload feature");
		}
		logger.info("Definition to be used: "+definitions.get(0));

		return definitions.get(0);

	}
	
	public String getJsonPathKey(String jsonPath, StringBuilder expression){
		String[] expressionArray = (jsonPath).split("[.]");
    	for(int j = 0; j < (expressionArray.length - 1) ; j++ ){
    		expression.append(expressionArray[j]);
    		if(j != expressionArray.length - 2)
    			expression.append(".");
    	}
    	return expressionArray[expressionArray.length - 1];
	}
	
//	private File getExcelFile(String path) throws Exception{
//		File file = new File(path);
//	    FileInputStream input = new FileInputStream(file);
//
//        return new File("");
//	}
	
	public String createANewFile(String fileName) throws IOException{
		String outputFile = internalFolderPath + File.separator + fileName;
        System.out.println("file create : "+outputFile);
		logger.info("Attempting to create a new file: "+outputFile);
		try (FileOutputStream fileOut = new FileOutputStream(outputFile);
             HSSFWorkbook workbook = new HSSFWorkbook();
		){
	        workbook.createSheet("Sheet 1");
	        workbook.write(fileOut);
            return outputFile;
		}
		
	}
	
	
	public void writeToexcelSheet(List<Object> rowData, String fileName) throws IOException {
		logger.info("Writing to file: "+fileName);
		try(InputStream stream = new FileInputStream(fileName);
        HSSFWorkbook workbook = new HSSFWorkbook(stream)) {
            HSSFSheet sheet = workbook.getSheetAt(0);
            int rowCount = sheet.getLastRowNum();
            Row row = sheet.createRow(++rowCount);
            for (int i = 0; i < rowData.size(); i++) {
                Cell cell = row.createCell(i);

                if (rowData.get(i) instanceof String) {
                    cell.setCellType(CellType.STRING);
                    cell.setCellValue(rowData.get(i).toString());
                } else if (rowData.get(i) instanceof Double) {
                    cell.setCellType(CellType.NUMERIC);
                    cell.setCellValue(Double.parseDouble(rowData.get(i).toString()));
                } else if (rowData.get(i) instanceof Long) {
                    if (13 == rowData.get(i).toString().length()) {
                        CellStyle cellStyle = workbook.createCellStyle();
                        CreationHelper createHelper = workbook.getCreationHelper();
                        cellStyle.setDataFormat(
                                createHelper.createDataFormat().getFormat("dd/mm/yyyy"));
                        cell.setCellValue(new Date(Long.parseLong(rowData.get(i).toString())));
                        cell.setCellStyle(cellStyle);
                    } else {
                        cell.setCellType(CellType.NUMERIC);
                        cell.setCellValue(Long.parseLong(rowData.get(i).toString()));
                    }
                } else if (rowData.get(i) instanceof Boolean) {
                    cell.setCellType(CellType.BOOLEAN);
                    cell.setCellValue(Boolean.parseBoolean(rowData.get(i).toString()));
                } else if(!Objects.isNull(rowData.get(i))){
                    cell.setCellType(CellType.STRING);
                    cell.setCellValue(rowData.get(i).toString());
                }

            }
            sheet.shiftRows(row.getRowNum(), rowCount, -1);
            try (FileOutputStream outputStream = new FileOutputStream(fileName)) {
                workbook.write(outputStream);
            }

        } catch (IOException e) {
            logger.error("Unable to write to output excel", e);
            throw e;
        }

    }

	public void clearInternalDirectory(){
		logger.info("Clearing the internal folder....: "+internalFolderPath);
		try{
			FileUtils.cleanDirectory(new File(internalFolderPath)); 
		}catch(Exception e){
			logger.error("Couldn't clean the folder: "+internalFolderPath, e);
		}
        
	}
	
	
	public List<Object> getResJsonPathList(Map<String, String> resFieldsMap, List<Object> columnHeaders){
		List<Object> jsonpathList = new ArrayList<>();
		for(Entry<String, String> entry: resFieldsMap.entrySet()){
			columnHeaders.add(entry.getValue());
			jsonpathList.add(entry.getKey());
		}
		
		return jsonpathList;
		
	}
	
	public List<Object> fetchValuesFromResponse(Object response, List<Object> jsonPathList) {
	    List<Object> values = new ArrayList<>();

        if( Objects.isNull(response) || response instanceof String ){
            for (Object obj : jsonPathList) {
                values.add(null);
            }
        }
        else {
            try{
            String responseString = objectMapper.writeValueAsString(response);
            for(Object path: jsonPathList){
                try{
                    Object value = JsonPath.read(responseString, path.toString());
                    logger.debug("Response value from JSON Path {} is {}", path.toString(), value);
                    values.add(value);
                }catch(Exception e){
                    values.add(null);
                }
            }
            }catch (JsonProcessingException e){
                for (Object obj : jsonPathList) {
                    values.add(null);
                }
            }
        }

		return values;
	}
	
	public String mockIdGen(String module, String defName){
		StringBuilder id = new StringBuilder();
		id.append(module).append("-").append(defName).append("-").append(new Date().getTime());
		logger.info("JOB CODE: "+id.toString());
		return id.toString();
	}

	public String getURI(String endPoint){
		logger.info("endpoint: "+endPoint);
		if(endPoint.contains("http://") || endPoint.contains("https://"))
			return endPoint;
		else
			return businessModuleHost + endPoint;
	}
	
	public List<List<Object>> filter(List<List<Object>> excelData, List<Integer> indexes, List<Object> row){
		List<List<Object>> result = null;
		logger.info("indexes: "+indexes);
		for(Integer index: indexes){
			logger.info("index: "+index);
			result = excelData.parallelStream()
					.filter(obj -> (obj.get(index)).equals(row.get(index)))
					.collect(Collectors.toList());
			
			excelData = result;
		}
		return result;
	}

	public static Map<String, List<List<Object>>> groupRowsByIndexes(List<List<Object>> excelData, List<Integer>
            indexes){
		Map<String, List<List<Object>>> map = new LinkedHashMap<>();

		for(List<Object> data : excelData){
			StringBuilder key = new StringBuilder();
			for(Integer index : indexes){
				key.append(data.get(index));
			}
			if(map.containsKey(key.toString())){
				map.get(key.toString()).add(data);
			}
			else {
				List<List<Object>> list = new ArrayList<>();
				list.add(data);
				map.put(key.toString(), list);
			}
		}

		return map;
	}
	
	public Map<String, Object> eliminateEmptyList(Map<String, Object> objectMap) {
		for(String key: objectMap.keySet()) {
			if(key.equals("RequestInfo") || key.equals("requestInfo")) {
			}else {
				if(!(objectMap.get(key) instanceof Map)) {
					continue;
				}
				Map<String, Object> moduleObject = (Map<String, Object>) objectMap.get(key);
				for(String mapKey: moduleObject.keySet()) {
					if(moduleObject.get(mapKey) instanceof List && !((List) moduleObject.get(mapKey)).isEmpty()) {
						logger.info("entering checkNull for: "+mapKey);
						if(checkNullPropsOfObject(((List)moduleObject.get(mapKey)).get(0))) {
							logger.info("setting empty list for the key: "+mapKey);
							moduleObject.put(mapKey, new ArrayList<>());
						}
					}
				}
				objectMap.put(key, moduleObject);
			}
		}
		return objectMap;
	}
	
	private boolean checkNullPropsOfObject(Object obj) {
		logger.info("Object: "+obj);
		if(obj instanceof Map) {
            Map<String, Object> objectMap = (Map<String, Object>) obj;
            for (Entry<String, Object> entry : objectMap.entrySet()) {
                if (entry.getKey().equals("tenantId"))
                    continue;

                if (!Objects.isNull(entry.getValue()) && !entry.getValue().toString().isEmpty())
                    return false;
            }
            return true;
        }
        return false;
    }

    public List<Integer> getIndexes(Definition uploadDefinition, List<String> columnHeaders) {
		List<Integer> indexes = new ArrayList<>();

		//Getting indexes of parentKeys from header list to filter data based on those keys.
		for(String key: uploadDefinition.getUniqueParentKeys()){
			indexes.add(columnHeaders.indexOf(key));
		}

		return indexes;
	}

//    public DocumentContext getDocumentContext(Definition uploadDefinition) {
//        if(uploadDefinition.getIsBulkApi()){
//            String value = JsonPath.read(uploadDefinition.getApiRequest(),
//                    uploadDefinition.getArrayPath()).toString();
//            //Module specific content of the request body
//            return  JsonPath.parse(value.substring(1, value.length() - 1));
//            //Actual request with RequestInfo and module specific content
//        }else{
//            //Actual request with RequestInfo and module specific content
//            return JsonPath.parse(uploadDefinition.getApiRequest());
//        }
//    }
//
//    public DocumentContext getBulkApiRequestContext(Definition uploadDefinition) {
//        if(uploadDefinition.getIsBulkApi()) {
//            return JsonPath.parse(uploadDefinition.getApiRequest());
//        }
//        return null;
//    }
}

