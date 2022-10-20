
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
 *         &lt;element name="dcode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="tcode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="nvcode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="period" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="khewat" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "dcode",
    "tcode",
    "nvcode",
    "period",
    "khewat"
})
@XmlRootElement(name = "GetKhewatTotalArea")
public class GetKhewatTotalArea {

    @XmlElement(name = "Key")
    protected String key;
    protected String dcode;
    protected String tcode;
    protected String nvcode;
    protected String period;
    protected String khewat;

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
     * Gets the value of the dcode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDcode() {
        return dcode;
    }

    /**
     * Sets the value of the dcode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDcode(String value) {
        this.dcode = value;
    }

    /**
     * Gets the value of the tcode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTcode() {
        return tcode;
    }

    /**
     * Sets the value of the tcode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTcode(String value) {
        this.tcode = value;
    }

    /**
     * Gets the value of the nvcode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNvcode() {
        return nvcode;
    }

    /**
     * Sets the value of the nvcode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNvcode(String value) {
        this.nvcode = value;
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

}
