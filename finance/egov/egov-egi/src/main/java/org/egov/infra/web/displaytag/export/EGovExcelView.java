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

package org.egov.infra.web.displaytag.export;

import org.apache.commons.lang.StringUtils;
import org.displaytag.export.BaseExportView;
import org.displaytag.model.Column;
import org.displaytag.model.ColumnIterator;
import org.displaytag.model.Row;
import org.displaytag.model.RowIterator;
import org.displaytag.model.TableModel;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.io.Writer;
import java.util.regex.Pattern;

import javax.servlet.jsp.JspException;

public class EGovExcelView extends BaseExportView {

    /**
	 * @see org.displaytag.export.BaseExportView#setParameters(TableModel, boolean, boolean, boolean)
	 */
    private TableModel model;
    private boolean decorated;
    private boolean exportFull;
    private boolean header;
	@Override
	public void setParameters(final TableModel tableModel, final boolean exportFullList, final boolean includeHeader, final boolean decorateValues) {
		super.setParameters(tableModel, exportFullList, includeHeader, decorateValues);
		this.model = tableModel;
	        this.exportFull = exportFullList;
	        this.header = includeHeader;
	        this.decorated = decorateValues;
	}

	/**
	 * @see org.displaytag.export.ExportView#getMimeType()
	 * @return "application/vnd.ms-excel"
	 */
	@Override
	public String getMimeType() {
		return "application/vnd.ms-excel"; //$NON-NLS-1$
	}

	/**
	 * @see org.displaytag.export.BaseExportView#getRowEnd()
	 */
	@Override
	protected String getRowEnd() {
		return "\n"; //$NON-NLS-1$
	}
	
	/**
	 * @see org.displaytag.export.BaseExportView#getCellEnd()
	 */
	@Override
	protected String getCellEnd() {
		return "\t"; //$NON-NLS-1$
	}

	@Override
	protected String getDocumentStart() {
		return escapeColumnValue(this.model.getCaption());
	}

	/**
	 * @see org.displaytag.export.BaseExportView#getAlwaysAppendCellEnd()
	 * @return false
	 */
	@Override
	protected boolean getAlwaysAppendCellEnd() {
		return false;
	}

	/**
	 * @see org.displaytag.export.BaseExportView#getAlwaysAppendRowEnd()
	 * @return false
	 */
	@Override
	protected boolean getAlwaysAppendRowEnd() {
		return false;
	}

	/**
	 * Escaping for excel format.
	 * <ul>
	 * <li>Quotes inside quoted strings are escaped with a double quote</li>
	 * <li>Fields are surrounded by " (should be optional, but sometimes you get a "Sylk error" without those)</li>
	 * </ul>
	 * @see org.displaytag.export.BaseExportView#escapeColumnValue(java.lang.Object)
	 */
	@Override
	protected String escapeColumnValue(Object value) {
		if (value != null && !value.toString().trim().equalsIgnoreCase("")) {
			// strip out the html tags
			value = removeHtmlTagsAndSpaces(value.toString());
			// quotes around fields are needed to avoid occasional "Sylk format invalid" messages from excel

			return "\"" //$NON-NLS-1$
					+ StringUtils.replace(StringUtils.trim(value.toString()), "\"", "\"\"") //$NON-NLS-1$ //$NON-NLS-2$ 
					+ "\""; //$NON-NLS-1$ 
		}

		return null;
	}

	/**
	 * Custom-method. Checks for nbsp spaces and replaces with empty string
	 */
	private String removeHtmlTagsAndSpaces(final String strValue) {
		String returnValue = null;
		if (strValue != null) {
			// if((strValue.trim().indexOf("&nbsp;") > -1) ||(strValue.trim().indexOf("<hr>") > -1) || (strValue.trim().indexOf("<B>") > -1) ||
			// (strValue.trim().indexOf("</B>") > -1) || (strValue.trim().indexOf("Br") > -1)) {
			final Reader strReader = new StringReader(strValue);
			final MyHtmlParser parser = new MyHtmlParser();
			returnValue = parser.parseMyHtml(strReader, true);
			// returnValue = returnValue.trim().replaceAll("\\s","");

		}
		return returnValue;
	}
	
	@Override
	public void doExport(Writer out) throws IOException, JspException {
	        final String DOCUMENT_START = getDocumentStart();
	        final String DOCUMENT_END = getDocumentEnd();
	        final String ROW_START = getRowStart();
	        final String ROW_END = getRowEnd();
	        final String CELL_START = getCellStart();
	        final String CELL_END = getCellEnd();
	        final boolean ALWAYS_APPEND_CELL_END = getAlwaysAppendCellEnd();
	        final boolean ALWAYS_APPEND_ROW_END = getAlwaysAppendRowEnd();

	        // document start
	        if(DOCUMENT_START != null && DOCUMENT_START.contains("\\n")){
	            String[] strArr = DOCUMENT_START.split(Pattern.quote("\\n"));
	            for(String str : strArr){
	                write(out, str.trim());
	                write(out, "\n");
	            }
	        }else{
	            write(out, DOCUMENT_START);
	        }
	        
	        if (ROW_END != null)
	        {
	            out.write(ROW_END);
	        }

	        if (this.header)
	        {
	            write(out, doHeaders());
	        }

	        // get the correct iterator (full or partial list according to the exportFull field)
	        RowIterator rowIterator = this.model.getRowIterator(this.exportFull);

	        // iterator on rows
	        while (rowIterator.hasNext())
	        {
	            Row row = rowIterator.next();

	            if (this.model.getTableDecorator() != null)
	            {

	                String stringStartRow = this.model.getTableDecorator().startRow();
	                write(out, stringStartRow);
	            }

	            // iterator on columns
	            ColumnIterator columnIterator = row.getColumnIterator(this.model.getHeaderCellList());

	            write(out, ROW_START);

	            while (columnIterator.hasNext())
	            {
	                Column column = columnIterator.nextColumn();

	                // Get the value to be displayed for the column
	                String value = escapeColumnValue(column.getValue(this.decorated));

	                write(out, CELL_START);

	                write(out, value);

	                if (ALWAYS_APPEND_CELL_END || columnIterator.hasNext())
	                {
	                    write(out, CELL_END);
	                }

	            }
	            if (ALWAYS_APPEND_ROW_END || rowIterator.hasNext())
	            {
	                write(out, ROW_END);
	            }
	        }

	        // document end
	        write(out, DOCUMENT_END);
	}
	
	private void write(Writer out, String string) throws IOException
	    {
	        if (string != null)
	        {
	            out.write(string);
	        }
	    }


}
