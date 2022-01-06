package com.ingestpipeline.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.NavigableMap;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.elasticsearch.search.aggregations.support.ValuesSource.Numeric;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.ingestpipeline.controller.RestApiController;
import com.ingestpipeline.service.IngestService;

@Component("readUtil")
public class ReadUtil {


	@Value("${filename.length}")
	private Integer filenameLengthValue;


	@Value("${filename.useletters}")
	private Boolean useLettersValue;

	@Value("${filename.usenumbers}")
	private Boolean useNumbersValue;


	private static Integer filenameLength;

	private static Boolean useLetters;

	private static Boolean useNumbers;

	@Value("${filename.length}")
	public void setFilenameLength(Integer filenameLengthValue) {
		ReadUtil.filenameLength = filenameLengthValue;
	}

	@Value("${filename.useletters}")
	public void setUseLetters(Boolean useLettersValue) {
		ReadUtil.useLetters = useLettersValue;
	}

	@Value("${filename.usenumbers}")
	public void setUseNumbers(Boolean useNumbersValue) {
		ReadUtil.useNumbers = useNumbersValue;
	}

	public static final Logger LOGGER = LoggerFactory.getLogger(ReadUtil.class);
	private static String UPLOADED_FOLDER = "";
	public static Path path;
	public static File uploadFile = new File(
			System.getProperty("user.dir") + System.getProperty("file.separator") + "uploads");

	public static JSONArray getFiletoDirectory(MultipartFile file) throws Exception {
		byte[] bytes = file.getBytes();
		if (!uploadFile.exists()) {
			uploadFile.mkdir();
		}
		UPLOADED_FOLDER = uploadFile.toString();


		String orignalFileName = file.getOriginalFilename();
		String randomString = RandomStringUtils.random(filenameLength, useLetters, useNumbers);
		String fileName =  System.currentTimeMillis() + randomString;
		String extension = FilenameUtils.getExtension(orignalFileName);

		path = Paths.get(UPLOADED_FOLDER + System.getProperty("file.separator") + fileName + '.' + extension);
		Files.write(path, bytes);
		JSONArray fileIntoJsonArray = readFilefromDirectory();
		String jsonArrayFileName = fileName + ".json";
		writeJsonArrayToFile(fileIntoJsonArray, jsonArrayFileName);
		return fileIntoJsonArray;
	}

	private static JSONArray readFilefromDirectory() throws Exception {
		String workbookSheetName = null;
		int workbookSheetIndex = -1;
		String getFileExtension = FilenameUtils.getExtension(path.toString());
		Workbook workbook = null;
		if (getFileExtension.endsWith("xlsx")) {
			workbook = new XSSFWorkbook();
			workbook = WorkbookFactory.create(new File(path.toString()));
		} else {
			throw new Exception("invalid file, should be xlsx");
		}

		JSONArray workbookToJsonArray = new JSONArray();
		for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
			Sheet sheet = workbook.getSheetAt(i);
			workbookSheetName = sheet.getSheetName();
			workbookSheetIndex = workbook.getSheetIndex(workbookSheetName);
			if (workbookSheetName != null && workbookSheetName.length() > 0) {
				workbookToJsonArray = workbookToJsonArray.put(getSheetToJsonObject(workbook, sheet));
			}
		}

		JSONArray bookInJsonArray = new JSONArray();
		for (int i = 0; i < workbookToJsonArray.length(); i++) {
			JSONArray sheetInJsonArray = new JSONArray();
			sheetInJsonArray = (JSONArray) workbookToJsonArray.get(i);
			Iterator itr = sheetInJsonArray.iterator();
			while (itr.hasNext()) {
				JSONObject obj = (JSONObject) itr.next();
				bookInJsonArray.put(obj);
			}
		}
		return bookInJsonArray;
	}

	private static JSONArray getSheetToJsonObject(Workbook workbook, Sheet sheet) {
		String workbookSheetName = sheet.getSheetName();
		int workbookSheetIndex = workbook.getSheetIndex(workbookSheetName);
		Object financialYear = null;
		int firstRowNum = sheet.getFirstRowNum(), lastRowNum = sheet.getLastRowNum(),
				ulbFirstRowNumber = Constants.HEADER_ROW + 2, ulbDestRowNumber = -1;
		Row row = null;
		int rowFirstCellNum = -1, rowLastCellNum = -1;
		List<List<Object>> rowRecordList = new LinkedList<List<Object>>();
		Map<Integer, List<Object>> rowRecordMap = new LinkedHashMap<Integer, List<Object>>();
		Map<Integer, List<Object>> municipalCity = new LinkedHashMap<Integer, List<Object>>();

		if (lastRowNum > 0) {
			for (int i = firstRowNum; i <= lastRowNum; i++) {
				row = sheet.getRow(i);
				if (row != null) {
					rowFirstCellNum = row.getFirstCellNum();
					rowLastCellNum = sheet.getRow(i).getLastCellNum();
					List<Object> rowRecord = new LinkedList<Object>();
					Map<Integer, List<Object>> singleRowDataMap = new LinkedHashMap<Integer, List<Object>>();
					for (int j = rowFirstCellNum; j < rowLastCellNum; j++) {
						Cell cell = row.getCell(j);
						if (isMergedRegion(workbook, sheet, i, j)) {
							sheet = getSheetMergerCellRegion(workbook, sheet, i, j);
						}
						singleRowDataMap.put(i, getRowRecord(cell, rowRecord));
					}

					if (!rowRecord.isEmpty()) {
						rowRecordList.add(rowRecord);
						// rowRecordMap.put(i, rowRecord);
						rowRecordMap.putAll(singleRowDataMap);

					}

					if (rowRecordList.size() == 1) {
						financialYear = rowRecordList.get(Constants.HEADER_ROW - 1).get(3).toString().trim();
					}
				}
			}
		}

		List<Object> sheetHeaderList = new LinkedList<Object>();
		List<String> customHeaderList = new LinkedList<String>();
		Map<String, Object> customHeaderMap = new LinkedHashMap<String, Object>();
		JSONArray getMunicipalCityToJsonArray = new JSONArray();
		Map<Integer, List<String>> lastRowRecord = new LinkedHashMap<Integer, List<String>>();
		customHeaderList.add("Sheet Name");
		customHeaderList.add("Financial Year");
		customHeaderList.add("Timestamp");
		// customHeaderList.add("Municipal Corporations");
		customHeaderMap.put(customHeaderList.get(0), workbookSheetName);
		customHeaderMap.put(customHeaderList.get(1), financialYear);
		DateFormat df = new SimpleDateFormat("dd/MM/yy HH:mm:S");
		Date dateobj = new Date();
		customHeaderMap.put(customHeaderList.get(2), df.format(dateobj));
		JSONObject customHeaderJsonObject = new JSONObject();
		JSONArray municipalCitiesIntoJsonArray = new JSONArray();
		for (Map.Entry<Integer, List<Object>> itrRowRecordMap : rowRecordMap.entrySet()) {
			if (itrRowRecordMap.getKey() == Constants.HEADER_ROW) {
				sheetHeaderList.addAll(itrRowRecordMap.getValue());
			}
			if (itrRowRecordMap.getKey() >= ulbFirstRowNumber) {
				JSONObject municipalCitiesIntoJsonObject = new JSONObject();
				Map<String, String> mc = new LinkedHashMap<String, String>();
				municipalCity.put(itrRowRecordMap.getKey(), itrRowRecordMap.getValue());
				for (Map.Entry<String, Object> itrCustomHeaderMap : customHeaderMap.entrySet()) {
					municipalCitiesIntoJsonObject.accumulate(itrCustomHeaderMap.getKey().toString(),
							itrCustomHeaderMap.getValue());
				}

				for (int i = 0; i < sheetHeaderList.size(); i++) {
					if ((!sheetHeaderList.get(i).toString().contentEquals("-"))
							&& (!itrRowRecordMap.getValue().get(i).toString().contentEquals("-"))) {

						municipalCitiesIntoJsonObject.put(sheetHeaderList.get(i).toString(),
								itrRowRecordMap.getValue().get(i));
					}
				}

				municipalCitiesIntoJsonArray.put(municipalCitiesIntoJsonObject);
			}
		}
		return municipalCitiesIntoJsonArray;
	}

	private static List<Object> getRowRecord(Cell cell, List<Object> rowRecord) {
		switch (cell.getCellType()) {
		case STRING:
			String str = cell.getRichStringCellValue().getString();
			str = str.replaceAll("(\\n\\s)+|(\\r\\n\\s)+|(\\r\\s)+|(\\r)+|(\\n)+|(\\s)+", " ");
			rowRecord.add(str);
			break;
		case NUMERIC:
			if (DateUtil.isCellDateFormatted(cell)) {
				rowRecord.add(cell.getDateCellValue());
				break;
			} else {
				Double d = cell.getNumericCellValue();
				DecimalFormat numberFormat = new DecimalFormat("#.00");
				rowRecord.add(Double.parseDouble(numberFormat.format(d)));
			}
			break;
		case BOOLEAN:
			rowRecord.add(cell.getBooleanCellValue());
			break;
		case FORMULA:
			if (cell.getCachedFormulaResultType().equals(CellType.NUMERIC)) {
				Double d = cell.getNumericCellValue() * 100;
				DecimalFormat numberFormat = new DecimalFormat("#.00");
				rowRecord.add(Double.parseDouble(numberFormat.format(d)));
				break;
			} else if (cell.getCachedFormulaResultType().equals(CellType.STRING)) {
				rowRecord.add(cell.getNumericCellValue());
				break;
			}
			break;
		case BLANK:
			rowRecord.add("-");
			break;
		default:
			rowRecord.add("no type match");
			break;
		}
		return rowRecord;
	}

	private static boolean isMergedRegion(Workbook workbook, Sheet sheet, int cellRow, int cellColumn) {
		int retVal = 0;
		int sheetMergerCount = sheet.getNumMergedRegions();
		for (int i = 0; i < sheetMergerCount; i++) {
			CellRangeAddress region = sheet.getMergedRegion(i);
			int firstRow = region.getFirstRow(), firstCol = region.getFirstColumn(), lastRow = region.getLastRow(),
					lastCol = region.getLastColumn();
			if (cellRow >= firstRow && cellRow <= lastRow) {
				if (cellColumn >= firstCol && cellColumn <= lastCol) {
					retVal = lastCol - firstCol + 1;
					if (retVal > 0) {
						return true;
					}
					break;
				}
			}
		}
		return false;
	}

	private static Sheet getSheetMergerCellRegion(Workbook workbook, Sheet sheet, int cellRow, int cellColumn) {
		int retVal = 0;
		int sheetMergerCount = sheet.getNumMergedRegions();
		for (int i = 0; i < sheetMergerCount; i++) {
			CellRangeAddress region = sheet.getMergedRegion(i);
			int firstRow = region.getFirstRow();
			int firstCol = region.getFirstColumn();
			int lastRow = region.getLastRow();
			int lastCol = region.getLastColumn();
			if (cellRow >= firstRow && cellRow <= lastRow) {
				if (cellColumn >= firstCol && cellColumn <= lastCol) {
					retVal = lastCol - firstCol + 1;
					Row row = sheet.getRow(i);
					if (retVal > 0) {
						for (int j = firstRow; j <= lastRow; j++) {
							for (int k = firstCol; k <= lastCol; k++) {
								Cell cell = sheet.getRow(region.getFirstRow()).getCell(region.getFirstColumn());
								String stringValue1 = null;
								Double doubleValue1 = -1.00;
								Date dateValue1 = new Date();
								Boolean booleanValue1 = false;
								RichTextString formulaValue1 = null;
								switch (cell.getCellType()) {
								case STRING:
									stringValue1 = sheet.getRow(region.getFirstRow()).getCell(region.getFirstColumn())
											.getRichStringCellValue().getString();
									sheet.getRow(j).getCell(k).setCellValue(stringValue1);
									break;
								case NUMERIC:
									if (DateUtil.isCellDateFormatted(
											sheet.getRow(region.getFirstRow()).getCell(region.getFirstColumn()))) {
										dateValue1 = sheet.getRow(region.getFirstRow()).getCell(region.getFirstColumn())
												.getDateCellValue();
										sheet.getRow(j).getCell(k).setCellValue(dateValue1);
									} else {
										doubleValue1 = sheet.getRow(region.getFirstRow())
												.getCell(region.getFirstColumn()).getNumericCellValue();
										sheet.getRow(j).getCell(k).setCellValue(doubleValue1);
									}
									break;
								case BOOLEAN:
									booleanValue1 = sheet.getRow(region.getFirstRow()).getCell(region.getFirstColumn())
											.getBooleanCellValue();
									sheet.getRow(j).getCell(k).setCellValue(booleanValue1);
									break;
								case FORMULA:
									if (cell.getCachedFormulaResultType().equals(CellType.NUMERIC)) {
										doubleValue1 = cell.getNumericCellValue() * 100;
										sheet.getRow(j).getCell(k).setCellValue(doubleValue1);
										break;
									} else if (cell.getCachedFormulaResultType().equals(CellType.STRING)) {
										formulaValue1 = cell.getRichStringCellValue();
										sheet.getRow(j).getCell(k).setCellValue(formulaValue1);
										break;
									}
									break;
								case BLANK:
									break;
								default:
								}
							}
						}
					}
				}
			}
		}
		return sheet;
	}

	private static void writeJsonArrayToFile(JSONArray data, String fileName) throws IOException {
		String currentWorkingFolder = System.getProperty("user.dir"),
				filePathSeperator = System.getProperty("file.separator"),
				filePath = currentWorkingFolder + filePathSeperator + fileName;
		BufferedWriter bufferedWriter = null;
		try {
			bufferedWriter = new BufferedWriter(new FileWriter(new File(filePath)));
			bufferedWriter.write(data.toString());
		}catch (Exception e){
			LOGGER.error("Error while writing to file. ");
		}finally {
			bufferedWriter.flush();
			bufferedWriter.close();
		}
	}
}
