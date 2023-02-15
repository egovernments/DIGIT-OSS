package org.egov.dataupload.property;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;


import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.egov.dataupload.property.models.Document;
import org.egov.dataupload.property.models.OwnerInfo;
import org.egov.dataupload.property.models.OwnerInfo.RelationshipEnum;
import org.egov.dataupload.property.models.Property;
import org.egov.dataupload.property.models.PropertyDetail;
import org.egov.dataupload.property.models.Unit;
import org.egov.dataupload.utils.Constants.PTOwnerDetails;
import org.egov.dataupload.utils.Constants.PTTemplateDetail;
import org.egov.dataupload.utils.Constants.PTUnitDetail;
import org.egov.dataupload.utils.DataUploadUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class PropertyFileReader {

	@Autowired
	private DataUploadUtils dataUploadUtils;

	public Map<String, Sheet> readFile(String location) throws InvalidFormatException, IOException {
		Map<String, Sheet> sheetMap = new HashMap<>();

		// Creating a Workbook from an Excel file (.xls or .xlsx)
//		Workbook workbook = WorkbookFactory.create(new File(location));
		FileInputStream excelFile = null;
		Workbook workbook = null;
		try {
			excelFile = new FileInputStream(new File(location));
			workbook = new XSSFWorkbook(excelFile);
		}catch(Exception e){
			log.error("Error while creating workbook.");
		}finally {
			excelFile.close();
		}
		// Retrieving the number of sheets in the Workbook
		log.info("Workbook has " + workbook.getNumberOfSheets() + " Sheets : ");

		workbook.forEach(sheet -> {
			log.info("=> " + sheet.getSheetName());
			sheetMap.put(sheet.getSheetName(), sheet);
		});
		workbook.close();

		return sheetMap;
	}

	public Map<String, Map<String, Object>> parseExcel(String location) throws EncryptedDocumentException, InvalidFormatException, IOException {
		Map<String, Sheet> sheetMap = readFile(location);
		Map<String, Map<String, Object>> propertyIdMap = parsePropertyExcel(sheetMap);
		parseUnitDetail(sheetMap, propertyIdMap);
		parseOwnerDetail(sheetMap, propertyIdMap);
		
		return propertyIdMap;
		
	}
	public Map<String, Map<String, Object>> parsePropertyExcel(Map<String, Sheet> sheetMap) throws InvalidFormatException {

		Sheet propertySheet = sheetMap.get("Property_Detail");

		Map<String, Map<String, Object>> propertyIdMap = new LinkedHashMap<>();
		Iterator<Row> rowIterator = propertySheet.rowIterator();
		int rowNumber = 0;
		while (rowIterator.hasNext()) {
			Map<String, Object> rowData = new HashMap<>();
			Property property = new Property();
			property.getPropertyDetails().get(0).setAdditionalDetails(new HashMap<String, Object>());
			Row row = rowIterator.next();
			
			if (rowNumber++ == 0)
				continue;

			log.info("Property_Detail, processing row number" + rowNumber);
			// Check the existing property id column (which is 2)
			int existPropertyId_cellIndex= PTTemplateDetail.Existing_Property_Id.ordinal();

			if((row.getCell(existPropertyId_cellIndex) != null) && StringUtils.isEmpty(row.getCell(existPropertyId_cellIndex).getStringCellValue())){
				break;
			}

			if (!dataUploadUtils.getCellValueAsBoolean(row.getCell(PTTemplateDetail.Process.ordinal()))) {
				continue;
			}

			for (int i = 0; i < row.getLastCellNum(); i++) {
				Cell cell = row.getCell(i);
				if (null != cell)
					setPropertyDetails(cell, property);
			}
			if(!StringUtils.isEmpty(property.getOldPropertyId())){
				if(null != propertyIdMap.get(property.getOldPropertyId())) {
					StringBuilder id = new StringBuilder();
					id.append("duplicate_").append(property.getOldPropertyId()).append("_").append(rowNumber);
					rowData.put("Property", property);
					rowData.put("_rowindex", row.getRowNum());
					propertyIdMap.put(id.toString(), rowData);
				}
				else
				{
					rowData.put("Property", property);
					rowData.put("_rowindex", row.getRowNum());
					propertyIdMap.put(property.getOldPropertyId(), rowData);
				}
			}
			else
				continue;

		}
		
		return propertyIdMap;
	}

	@SuppressWarnings("unchecked")
	private void setPropertyDetails(Cell cell, Property property) throws InvalidFormatException {
		switch (PTTemplateDetail.from(cell.getColumnIndex())) {
			case Tenant:
				property.setTenantId(dataUploadUtils.getCellValueAsString(cell));
				break;
			case City:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					property.getAddress().setCity(dataUploadUtils.getCellValueAsString(cell));
					break;
			case Existing_Property_Id:
				property.setOldPropertyId(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Financial_Year:
				property.getPropertyDetails().get(0).setFinancialYear(dataUploadUtils.getCellValueAsString(cell));
				break;
			case PropertyType:
				property.getPropertyDetails().get(0).setPropertyType(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Property_Sub_Type:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					property.getPropertyDetails().get(0).setPropertySubType(dataUploadUtils.getCellValueAsString(cell));
					break;
			case Is_your_property_height_above_36:
				Map<String, Object> addDetails = (Map<String, Object>) property.getPropertyDetails().get(0)
						.getAdditionalDetails();
				addDetails.put("heightAbove36Feet", dataUploadUtils.getCellValueAsBoolean(cell));
				break;
			case Do_you_Store_Inflammable_material:
				Map<String, Object> addDetailsMap = (Map<String, Object>) property.getPropertyDetails().get(0)
						.getAdditionalDetails();
				addDetailsMap.put("inflammable", dataUploadUtils.getCellValueAsBoolean(cell));
				break;
			case Usage_Category_Major:
				property.getPropertyDetails().get(0).setUsageCategoryMajor(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Usage_Category_Minor:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					property.getPropertyDetails().get(0).setUsageCategoryMinor(dataUploadUtils.getCellValueAsString(cell));
				else
					property.getPropertyDetails().get(0).setUsageCategoryMinor(null);
				break;
			// in case of shared property value should go to built up area else land area
			case Land_Area_Buildup_Area:
				float fval = (float)dataUploadUtils.getCellValueAsDouble(cell);
				if(fval == 0) break;
				else if ("SHAREDPROPERTY".equalsIgnoreCase(property.getPropertyDetails().get(0).getPropertySubType()))
					property.getPropertyDetails().get(0).setBuildUpArea(fval);
				else
					property.getPropertyDetails().get(0).setLandArea(fval);
				break;
			case No_of_Floors:
				long dval = (long)dataUploadUtils.getCellValueAsDouble(cell);
				if(dval == 0) break;
				if ("SHAREDPROPERTY".equalsIgnoreCase(property.getPropertyDetails().get(0).getPropertySubType()))
					// In case of SharedProperty set the no of floors as 2 as currently done by UI
					// This will make sure 
					property.getPropertyDetails().get(0).setNoOfFloors(2L);
				else
					property.getPropertyDetails().get(0).setNoOfFloors(dval);
				break;
			case Ownership_Category:
				property.getPropertyDetails().get(0).setOwnershipCategory(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Sub_Ownership_Category:
				property.getPropertyDetails().get(0).setSubOwnershipCategory(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Locality:
				property.getAddress().getLocality().setCode(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Door_No:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					property.getAddress().setDoorNo(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Building_Name:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					property.getAddress().setBuildingName(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Street_Name:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					property.getAddress().setStreet(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Pincode:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					property.getAddress().setPincode(dataUploadUtils.getCellValueAsString(cell));
				break;

			default:
				break;
		}

		System.out.print("\t");
	}

	private void parseUnitDetail(Map<String, Sheet> sheetMap, Map<String, Map<String, Object>> propertyIdMap) throws InvalidFormatException {

		Sheet propertyUnitSheet = sheetMap.get("Unit_Detail");
		Iterator<Row> rowIterator = propertyUnitSheet.rowIterator();

		int rowNumber = 0;
		while (rowIterator.hasNext()) {
			Row row = rowIterator.next();

			if (rowNumber++ == 0)
				continue;

			log.info("Unit_Detail, processing row number" + rowNumber);
			// Break if now value in existing property ID
			int existingPTId_cellIndex=PTUnitDetail.Existing_Property_Id.ordinal();
			if((row.getCell(existingPTId_cellIndex)!=null)&&StringUtils.isEmpty(row.getCell(existingPTId_cellIndex).getStringCellValue())){
				break;
			}

			String propertyId = dataUploadUtils.getCellValueAsString(row.getCell(existingPTId_cellIndex));

			if (propertyIdMap.get(propertyId) == null)
				continue;

			Property property = (Property) propertyIdMap.get(propertyId).get("Property");

			Unit unit = new Unit();

			for (int i = 0; i < row.getLastCellNum(); i++) {
				Cell cell = row.getCell(i);
				if (null != cell)
					setUnitDetails(cell, unit);
			}
			property.getPropertyDetails().get(0).getUnits().add(unit);
		}
	}

	private void setUnitDetails(Cell cell, Unit unit) throws InvalidFormatException {

		switch (PTUnitDetail.from(cell.getColumnIndex())) {
			case Tenant:
				unit.setTenantId(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Existing_Property_Id:
				break;
			case Floor_No:
				unit.setFloorNo(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Unit_No:
				break;
			case Unit_Usage:
				unit.setUsageCategoryMajor(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Unit_Sub_usage:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					unit.setUsageCategoryMinor(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Occupancy:
				unit.setOccupancyType(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Built_up_area:
				if(dataUploadUtils.getCellValueAsDouble(cell) == 0) break;
				unit.setUnitArea((float) dataUploadUtils.getCellValueAsDouble(cell));
				break;
			case Annual_rent:
				if(dataUploadUtils.getCellValueAsDouble(cell)==0) break;
				unit.setArv(new BigDecimal(dataUploadUtils.getCellValueAsDouble(cell), MathContext.DECIMAL64));
				break;
			case UsageCategorySubMinor:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					unit.setUsageCategorySubMinor(dataUploadUtils.getCellValueAsString(cell));
				break;
			case UsageCategoryDetail:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					unit.setUsageCategoryDetail(dataUploadUtils.getCellValueAsString(cell));
				break;
			default:
				break;
		}

		System.out.print("\t");
	}

	private void parseOwnerDetail(Map<String, Sheet> sheetMap, Map<String, Map<String, Object>> propertyIdMap) throws InvalidFormatException {

		Sheet propertyUnitSheet = sheetMap.get("Owner_Detail");
		Iterator<Row> rowIterator = propertyUnitSheet.rowIterator();

		int rowNumber = 0;
		while (rowIterator.hasNext()) {
			Row row = rowIterator.next();

			if (rowNumber++ == 0)
				continue;

			log.info("Owner_Detail, processing row number" + rowNumber);

			// Checking if existing property id is blank, then break
			int existingPTId_cellIndex= PTOwnerDetails.Existing_Property_ID.ordinal();
			if((row.getCell(existingPTId_cellIndex)!=null)&&StringUtils.isEmpty(row.getCell(existingPTId_cellIndex).getStringCellValue())){
				break;
			}

			String propertyId = row.getCell(existingPTId_cellIndex).getStringCellValue();

			if (propertyIdMap.get(propertyId) == null) {
				continue;
			}

			Property property = (Property) propertyIdMap.get(propertyId).get("Property");
			String ownershipCategory=property.getPropertyDetails().get(0).getOwnershipCategory();

			if (null == property)
				continue;
			
			PropertyDetail dtl = property.getPropertyDetails().get(0);
			OwnerInfo owner = new OwnerInfo();
			Document ownerDoc = new Document();
			for (int i = 0; i < row.getLastCellNum(); i++) {
				Cell cell = row.getCell(i);
				if (null != cell)
					setOwnerDetails(cell, owner, ownerDoc,ownershipCategory);
			}
			
			// setting documents to owner
			HashSet<Document> docs = new HashSet<>();
			docs.add(ownerDoc);
			owner.setDocuments(docs);
			
			/*
			 * Adding citizen info. 
			 * The first owner object encountered for a property will be
			 * set as primary owner
			 */
			if (CollectionUtils.isEmpty(dtl.getOwners())) dtl.setCitizenInfo(owner);
			dtl.getOwners().add(owner);
		}
	}

	private void setOwnerDetails(Cell cell, OwnerInfo ownerInfo, Document document,String ownershipCategory) throws InvalidFormatException {

		switch (PTOwnerDetails.from(cell.getColumnIndex())) {
			case Tenant:
				ownerInfo.setTenantId(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Existing_Property_ID:
				break;
			case Name:
				ownerInfo.setName(dataUploadUtils.getCellValueAsString(cell));
				break;
			case MobileNumber:
				cell.setCellType(CellType.STRING);
				ownerInfo.setMobileNumber(dataUploadUtils.getCellValueAsString(cell));
				if(ownershipCategory.equals("INSTITUTIONALPRIVATE")||ownershipCategory.equals("INSTITUTIONALGOVERNMENT"))
				{
					ownerInfo.setAltContactNumber(dataUploadUtils.getCellValueAsString(cell));
				}
				break;
			case Father_Or_Husband_Name:
				ownerInfo.setFatherOrHusbandName(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Relationship:
				ownerInfo.setRelationship(RelationshipEnum.fromValue(dataUploadUtils.getCellValueAsString(cell)));
				break;
			case PermanentAddress:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					ownerInfo.setPermanentAddress(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Owner_Type:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					ownerInfo.setOwnerType(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Id_Type:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					document.setDocumentType(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Document_No:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					document.setDocumentUid(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Email:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					ownerInfo.setEmailId(dataUploadUtils.getCellValueAsString(cell));
				break;
			case Gender:
				if (!StringUtils.isEmpty(dataUploadUtils.getCellValueAsString(cell)))
					ownerInfo.setGender(dataUploadUtils.getCellValueAsString(cell));
				break;
		
			default:
				break;
		}

		System.out.print("\t");
	}
}
