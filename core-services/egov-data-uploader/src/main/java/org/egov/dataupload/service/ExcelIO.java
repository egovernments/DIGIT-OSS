package org.egov.dataupload.service;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.egov.dataupload.model.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Component
public class ExcelIO implements FileIO {

    private static final Logger logger = LoggerFactory.getLogger(ExcelIO.class);
    private static final DataFormatter dataFormatter = new DataFormatter();
    private DateFormat format = new SimpleDateFormat("dd/MM/YYYY");



    public boolean checkIfRowisEmpty(Row row, int lastColumn){
        for (int colNum = 0; colNum < lastColumn; colNum++)
        {
            Cell cell = row.getCell(colNum, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
            if ((null == cell)|| StringUtils.isEmpty(cell.getStringCellValue())) {
                continue;
            }
            else{
                return false;
            }
        }
        return true;
    }

    @Override
    public Document read(InputStream stream) throws IOException {
        try (Workbook wb = WorkbookFactory.create(stream)) {
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
                if ((null == row)) {
                    break;
                }
                int lastColumn;
                if (rowNum == 0) {
                    totalRows = row.getLastCellNum();
                    lastColumn = totalRows;
                } else {
                    lastColumn = Math.max(totalRows, row.getLastCellNum());
                }
                // end when empty row found
                if(checkIfRowisEmpty(row,lastColumn)){
                    break;
                }
                for (int colNum = 0; colNum < lastColumn; colNum++) {
                    Cell cell = row.getCell(colNum, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
                    if (null == cell) {
                        dataList.add(null);
                    } else if (0 == cell.getRowIndex()) {
                        columnHeaders.add(cell.getStringCellValue());
                    } else {
                        switch (cell.getCellTypeEnum()) {
                            case NUMERIC:
                                if (CellType.NUMERIC == cell.getCellTypeEnum()) {
                                    if (HSSFDateUtil.isCellDateFormatted(cell)) {
                                        dataList.add(format.format(new Date(cell.getDateCellValue().getTime())));
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

        } catch (IOException e) {
            logger.error("Unable to open stream.", e);
            throw e;
        } catch (InvalidFormatException e) {
            logger.error("Invalid format found, not an excel file. ", e);
            throw new IOException("Invalid file format provided, not an excel file");
        }

    }

    @Override
    public void write(OutputStream stream, Document document) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet();
            int rowCount = 0;
            if(!document.getHeaders().isEmpty()){
                Row row = sheet.createRow(rowCount++);
                populateRow(row, document.getHeaders());
            }
            for (List<Object> rowData : document.getRows()) {
                Row row = sheet.createRow(rowCount++);
                populateRow(row, rowData);
            }

            workbook.write(stream);

        } catch (IOException e) {
            logger.error("Unable to write to output excel", e);
            throw e;
        }


    }

    private boolean validateDate(String date) {
        boolean isValid = false;
        String dateRegex = "([0-9]{2})\\\\([0-9]{2})\\\\([0-9]{4})";
        if (date.matches(dateRegex))
            isValid = true;

        return isValid;
    }


    private <T> void populateRow(Row row, List<T> rowData){
        int columnCount = 0;

        for (T column : rowData) {
            Cell cell = row.createCell(columnCount++);
            setCellValue(cell, column);
        }
    }

    private void setCellValue(Cell cell, Object columnValue) {
        if (columnValue instanceof String) {
            cell.setCellType(CellType.STRING);
            cell.setCellValue(columnValue.toString());
        } else if (columnValue instanceof Double) {
            cell.setCellType(CellType.NUMERIC);
            cell.setCellValue(Double.parseDouble(columnValue.toString()));
        } else if (columnValue instanceof Long) {
                cell.setCellType(CellType.NUMERIC);
                cell.setCellValue(Long.parseLong(columnValue.toString()));
        } else if (columnValue instanceof Boolean) {
            cell.setCellType(CellType.BOOLEAN);
            cell.setCellValue(Boolean.parseBoolean(columnValue.toString()));
        } else if (!Objects.isNull(columnValue)) {
            cell.setCellType(CellType.STRING);
            cell.setCellValue(columnValue.toString());
        }

    }
}
