package org.egov.edcr.entity;


import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.egov.infra.filestore.entity.FileStoreMapper;
import org.egov.infra.persistence.entity.AbstractAuditable;


@Entity
@Table(name = "EDCR_PDF_DETAIL")
@SequenceGenerator(name = EdcrPdfDetail.SEQ_EDCR_PDF_DETAIL, sequenceName = EdcrPdfDetail.SEQ_EDCR_PDF_DETAIL, allocationSize = 1)
public class EdcrPdfDetail extends AbstractAuditable {

    public static final String SEQ_EDCR_PDF_DETAIL = "SEQ_EDCR_PDF_DETAIL";

    private static final long serialVersionUID = 63L;

    @Id
    @GeneratedValue(generator = SEQ_EDCR_PDF_DETAIL, strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "applicationdetail")
    private EdcrApplicationDetail edcrApplicationDetail;

    private String layer;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "convertedpdf")
    private FileStoreMapper convertedPdf;

    private String failureReasons;

    private String standardViolations;

    @Transient
    private List<String> violations;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    protected void setId(Long id) {
        this.id = id;
    }

    public String getLayer() {
        return layer;
    }

    public void setLayer(String layer) {
        this.layer = layer;
    }

    public FileStoreMapper getConvertedPdf() {
        return convertedPdf;
    }

    public void setConvertedPdf(FileStoreMapper convertedPdf) {
        this.convertedPdf = convertedPdf;
    }

    public String getFailureReasons() {
        return failureReasons;
    }

    public void setFailureReasons(String failureReasons) {
        this.failureReasons = failureReasons;
    }

    public EdcrApplicationDetail getEdcrApplicationDetail() {
        return edcrApplicationDetail;
    }

    public void setEdcrApplicationDetail(EdcrApplicationDetail edcrApplicationDetail) {
        this.edcrApplicationDetail = edcrApplicationDetail;
    }

    public String getStandardViolations() {
        return standardViolations;
    }

    public void setStandardViolations(String standardViolations) {
        this.standardViolations = standardViolations;
    }

    public List<String> getViolations() {
        return violations;
    }

    public void setViolations(List<String> violations) {
        this.violations = violations;
    }

}
