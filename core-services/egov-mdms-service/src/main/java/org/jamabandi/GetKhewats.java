
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
    "nvCode"
})
@XmlRootElement(name = "GetKhewats")
public class GetKhewats {

    @XmlElement(name = "Key")
    protected String key;
    @XmlElement(name = "DCode")
    protected String dCode;
    @XmlElement(name = "TCode")
    protected String tCode;
    @XmlElement(name = "NVCode")
    protected String nvCode;

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

}
