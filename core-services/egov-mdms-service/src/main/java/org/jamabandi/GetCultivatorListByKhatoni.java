
package org.jamabandi;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Key" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="DCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NVCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="period" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="khewat" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="khatoni" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="kashatCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "key",
    "dCode",
    "tCode",
    "nvCode",
    "period",
    "khewat",
    "khatoni",
    "kashatCode"
})
@XmlRootElement(name = "GetCultivatorListByKhatoni")
public class GetCultivatorListByKhatoni {

    @XmlElement(name = "Key")
    protected String key;
    @XmlElement(name = "DCode")
    protected String dCode;
    @XmlElement(name = "TCode")
    protected String tCode;
    @XmlElement(name = "NVCode")
    protected String nvCode;
    protected String period;
    protected String khewat;
    protected String khatoni;
    protected String kashatCode;

    /**
     * Gets the value of the key property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKey() {
        return key;
    }

    /**
     * Sets the value of the key property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKey(String value) {
        this.key = value;
    }

    /**
     * Gets the value of the dCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDCode() {
        return dCode;
    }

    /**
     * Sets the value of the dCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDCode(String value) {
        this.dCode = value;
    }

    /**
     * Gets the value of the tCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTCode() {
        return tCode;
    }

    /**
     * Sets the value of the tCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTCode(String value) {
        this.tCode = value;
    }

    /**
     * Gets the value of the nvCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNVCode() {
        return nvCode;
    }

    /**
     * Sets the value of the nvCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNVCode(String value) {
        this.nvCode = value;
    }

    /**
     * Gets the value of the period property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPeriod() {
        return period;
    }

    /**
     * Sets the value of the period property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPeriod(String value) {
        this.period = value;
    }

    /**
     * Gets the value of the khewat property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKhewat() {
        return khewat;
    }

    /**
     * Sets the value of the khewat property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKhewat(String value) {
        this.khewat = value;
    }

    /**
     * Gets the value of the khatoni property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKhatoni() {
        return khatoni;
    }

    /**
     * Sets the value of the khatoni property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKhatoni(String value) {
        this.khatoni = value;
    }

    /**
     * Gets the value of the kashatCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKashatCode() {
        return kashatCode;
    }

    /**
     * Sets the value of the kashatCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKashatCode(String value) {
        this.kashatCode = value;
    }

}
