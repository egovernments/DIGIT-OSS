package org.egov.edcr.service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Service;

import ar.com.fdvs.dj.domain.Style;
import ar.com.fdvs.dj.domain.constants.Border;
import ar.com.fdvs.dj.domain.constants.Font;
import ar.com.fdvs.dj.domain.constants.HorizontalAlign;
import ar.com.fdvs.dj.domain.constants.Stretching;
import ar.com.fdvs.dj.domain.constants.Transparency;
import ar.com.fdvs.dj.domain.constants.VerticalAlign;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;

@Service
public class JasperReportService {

    public InputStream exportPdf(final JasperPrint jasperPrint) throws JRException, IOException {
        ByteArrayOutputStream outputBytes = new ByteArrayOutputStream(1 * 1024 * 1024);
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputBytes);
        InputStream inputStream = new ByteArrayInputStream(outputBytes.toByteArray());
        // closeStream(reportStream);
        return inputStream;
    }

   

    public Style getConcurrenceColumnStyle() {
        final Style columnStyle = new Style("ColumnCss");
        columnStyle.setBorderLeft(Border.THIN());
        columnStyle.setBorderRight(Border.THIN());
        columnStyle.setTextColor(Color.black);
        columnStyle.setHorizontalAlign(HorizontalAlign.CENTER);
        columnStyle.setFont(new Font(5, Font._FONT_ARIAL, false));
        columnStyle.setTransparency(Transparency.OPAQUE);
        columnStyle.setBorderBottom(Border.THIN());
        columnStyle.setTransparent(false);
        return columnStyle;
    }
    
    public Style getBudgetReportDetailStyle() {
        final Style detailStyle = new Style("detail");
        detailStyle.setBorderLeft(Border.THIN());
        detailStyle.setBorderRight(Border.THIN());
        detailStyle.setBorderTop(Border.THIN());
        detailStyle.setBorderBottom(Border.THIN());
        detailStyle.setTextColor(Color.black);
        detailStyle.setFont(new Font(8, Font._FONT_VERDANA, true));
        detailStyle.setTransparency(Transparency.OPAQUE);
        return detailStyle;
    }
    
    public Style getDetailStyle() {
        final Style detailStyle = new Style("detail");
        detailStyle.setBorderLeft(Border.THIN());
        detailStyle.setBorderRight(Border.THIN());
        detailStyle.setBorderTop(Border.THIN());
        detailStyle.setBorderBottom(Border.THIN());
        detailStyle.setTextColor(Color.BLACK);
        detailStyle.setHorizontalAlign(HorizontalAlign.LEFT);
        detailStyle.setVerticalAlign(VerticalAlign.TOP);
        detailStyle.setFont(new Font(8, Font._FONT_VERDANA, true));
        detailStyle.setTransparency(Transparency.OPAQUE);
        return detailStyle;
    }
    
    public Style getDetailStyle(Color color) {
        final Style detailStyle = new Style("detail");
        detailStyle.setBorderLeft(Border.THIN());
        detailStyle.setBorderRight(Border.THIN());
        detailStyle.setBorderTop(Border.THIN());
        detailStyle.setBorderBottom(Border.THIN());
        detailStyle.setTextColor(color);
        detailStyle.setHorizontalAlign(HorizontalAlign.LEFT);
        detailStyle.setVerticalAlign(VerticalAlign.TOP);
        detailStyle.setFont(new Font(8, Font._FONT_VERDANA, true));
        detailStyle.setTransparency(Transparency.OPAQUE);
        return detailStyle;
    }

    public Style getHeaderStyle() {
        final Style headerStyle = new Style("header");
        headerStyle.setFont(Font.ARIAL_MEDIUM_BOLD);
        headerStyle.setBorder(Border.THIN());
        headerStyle.setBackgroundColor(new Color(204, 204, 204));
        headerStyle.setTextColor(Color.blue);
        headerStyle.setHorizontalAlign(HorizontalAlign.CENTER);
        headerStyle.setVerticalAlign(VerticalAlign.MIDDLE);
        headerStyle.setTransparency(Transparency.OPAQUE);
        headerStyle.setFont(new Font(8, Font._FONT_VERDANA, true));
        headerStyle.setStretchWithOverflow(true);
        return headerStyle;
    }

    public Style getColumnStyle() {
        final Style columnStyle = new Style("ColumnCss");
        columnStyle.setBorderLeft(Border.THIN());
        columnStyle.setBorderRight(Border.THIN());
        columnStyle.setBorderBottom(Border.THIN());
        columnStyle.setBorderTop(Border.THIN());
        columnStyle.setTextColor(Color.black);
        columnStyle.setHorizontalAlign(HorizontalAlign.LEFT); 
        columnStyle.setFont(new Font(9, Font._FONT_TIMES_NEW_ROMAN, false));
        columnStyle.setStreching(Stretching.RELATIVE_TO_BAND_HEIGHT);   
        columnStyle.setStretchWithOverflow(true);
        columnStyle.setVerticalAlign(VerticalAlign.MIDDLE);

        columnStyle.setTransparent(false);  
        columnStyle.setPaddingRight(2);
        
        return columnStyle; 
    }


    public Style getNumberStyle() {
        final Style columnStyle = new Style("NumberCss");
        columnStyle.setBorderLeft(Border.THIN());
        columnStyle.setBorderRight(Border.THIN());
        columnStyle.setBorderBottom(Border.THIN());
        columnStyle.setBorderTop(Border.THIN());
        columnStyle.setTextColor(Color.black);
        columnStyle.setHorizontalAlign(HorizontalAlign.RIGHT);
        columnStyle.setFont(new Font(9, Font._FONT_TIMES_NEW_ROMAN, false));
        columnStyle.setStreching(Stretching.RELATIVE_TO_BAND_HEIGHT);
        columnStyle.setStretchWithOverflow(true);
        columnStyle.setVerticalAlign(VerticalAlign.MIDDLE);

        columnStyle.setTransparent(false);
        columnStyle.setPaddingRight(2);

        return columnStyle;
    }

    public Style getTotalNumberStyle() {
        final Style columnStyle = new Style("TotalNumberCss");
        columnStyle.setBorderLeft(Border.THIN());
        columnStyle.setBorderRight(Border.THIN());
        columnStyle.setBorderBottom(Border.THIN());
        columnStyle.setBorderTop(Border.THIN());
        columnStyle.setTextColor(Color.black);
        columnStyle.setHorizontalAlign(HorizontalAlign.RIGHT);
        columnStyle.setFont(new Font(9, Font._FONT_TIMES_NEW_ROMAN, false));
        columnStyle.setStreching(Stretching.RELATIVE_TO_BAND_HEIGHT);
        columnStyle.setStretchWithOverflow(true);
        columnStyle.setVerticalAlign(VerticalAlign.MIDDLE);

        columnStyle.setTransparent(false);
        columnStyle.setPaddingRight(2);
        columnStyle.setPattern("0.00");

        return columnStyle;
    }

    public Style getVerifiedColumnStyle() {
        final Style columnStyle = new Style("ColumnCss");
        columnStyle.setBorderLeft(Border.THIN());
        columnStyle.setBorderRight(Border.THIN());
        columnStyle.setTextColor(Color.black);
        columnStyle.setHorizontalAlign(HorizontalAlign.CENTER);
        columnStyle.setFont(new Font(10, Font._FONT_COMIC_SANS, false));
        columnStyle.setBorderBottom(Border.THIN());
        return columnStyle;
    }

    public Style getColumnHeaderStyle() {
        final Style columnheaderStyle = new Style("ColumnHeaderCss");
        columnheaderStyle.setBorderLeft(Border.THIN());
        columnheaderStyle.setBorderRight(Border.THIN());
        columnheaderStyle.setBorderTop(Border.THIN());
        columnheaderStyle.setBorderBottom(Border.THIN());
        columnheaderStyle.setTextColor(Color.black);
        columnheaderStyle.setHorizontalAlign(HorizontalAlign.CENTER);
        columnheaderStyle.setVerticalAlign(VerticalAlign.MIDDLE);
        columnheaderStyle.setFont(new Font(8, Font._FONT_ARIAL, true));
        return columnheaderStyle;
    }

    public Style getBldgDetlsHeaderStyle() {
        final Style columnheaderStyle = new Style("BldgDtlHeaderCss");
        columnheaderStyle.setBorderLeft(Border.THIN());
        columnheaderStyle.setBorderRight(Border.THIN());
        columnheaderStyle.setBorderTop(Border.THIN());
        columnheaderStyle.setBorderBottom(Border.THIN());
        columnheaderStyle.setTextColor(Color.black);
        columnheaderStyle.setHorizontalAlign(HorizontalAlign.CENTER);
        columnheaderStyle.setVerticalAlign(VerticalAlign.MIDDLE);
        columnheaderStyle.setFont(new Font(9, Font._FONT_ARIAL, true));
        return columnheaderStyle;
    }

    public Style getTitleStyle() {
        final Style titleStyle = new Style("titleStyle");
        titleStyle.setFont(new Font(10, Font._FONT_ARIAL, true));
        titleStyle.setHorizontalAlign(HorizontalAlign.LEFT);
        return titleStyle;
    }
    public Style getSubReportTitleStyle() {
        final Style titleStyle = new Style("subReportTitleStyle");
        titleStyle.setFont(new Font(12, Font._FONT_ARIAL, true));
        titleStyle.setHorizontalAlign(HorizontalAlign.LEFT);
        titleStyle.setTextColor(new Color(0, 0, 255));
        return titleStyle;
    }

    public Style getSubTitleStyle() {
        final Style subTitleStyle = new Style("subTitleStyle");
        subTitleStyle.setBorderLeft(Border.NO_BORDER());
        subTitleStyle.setBorderRight(Border.NO_BORDER());
        subTitleStyle.setBorderTop(Border.NO_BORDER());
        subTitleStyle.setBorderBottom(Border.NO_BORDER());
        subTitleStyle.setTextColor(Color.black);
        subTitleStyle.setFont(new Font(9, Font._FONT_ARIAL, true));
        subTitleStyle.setHorizontalAlign(HorizontalAlign.LEFT);
        subTitleStyle.setVerticalAlign(VerticalAlign.MIDDLE);
        return subTitleStyle;
    }

   

    public Style getAcceptedResultStyle() {

        final Style columnResultStyle = new Style("ColumnResultCss");
        columnResultStyle.setBorderLeft(Border.THIN());
        columnResultStyle.setBorderRight(Border.THIN());
        columnResultStyle.setTextColor(Color.GREEN);
        columnResultStyle.setHorizontalAlign(HorizontalAlign.CENTER);
        columnResultStyle.setFont(new Font(8, Font._FONT_TIMES_NEW_ROMAN, false));
        columnResultStyle.setBorderBottom(Border.THIN());
        return columnResultStyle;
    }

    public Style getNotAcceptedResultStyle() {

        final Style columnResultStyle = new Style("ColumnResultCss");
        columnResultStyle.setBorderLeft(Border.THIN());
        columnResultStyle.setBorderRight(Border.THIN());
        columnResultStyle.setTextColor(Color.RED);
        columnResultStyle.setHorizontalAlign(HorizontalAlign.CENTER);
        columnResultStyle.setFont(new Font(8, Font._FONT_TIMES_NEW_ROMAN, false));
        columnResultStyle.setBorderBottom(Border.THIN());
        return columnResultStyle;
    }

    public Style getVerifyResultStyle() {

        final Style columnResultStyle = new Style("ColumnResultCss");
        columnResultStyle.setBorderLeft(Border.THIN());
        columnResultStyle.setBorderRight(Border.THIN());
        columnResultStyle.setTextColor(Color.RED);
        columnResultStyle.setHorizontalAlign(HorizontalAlign.CENTER);
        columnResultStyle.setFont(new Font(8, Font._FONT_TIMES_NEW_ROMAN, false));
        columnResultStyle.setBorderBottom(Border.THIN());
        return columnResultStyle;
    }

   

}