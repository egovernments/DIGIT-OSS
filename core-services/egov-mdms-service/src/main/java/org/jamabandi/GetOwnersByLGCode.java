
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
 *         &lt;element name="LGVillCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Mustno" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Khasra" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "lgVillCode",
    "mustno",
    "khasra"
})
@XmlRootElement(name = "GetOwnersByLGCode")
public class GetOwnersByLGCode {

    @XmlElement(name = "Key")
    protected String key;
    @XmlElement(name = "LGVillCode")
    protected String lgVillCode;
    @XmlElement(name = "Mustno")
    protected String mustno;
    @XmlElement(name = "Khasra")
    protected String khasra;

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
     * Gets the value of the lgVillCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLGVillCode() {
        return lgVillCode;
    }

    /**
     * Sets the value of the lgVillCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLGVillCode(String value) {
        this.lgVillCode = value;
    }

    /**
     * Gets the value of the mustno property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMustno() {
        return mustno;
    }

    /**
     * Sets the value of the mustno property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMustno(String value) {
        this.mustno = value;
    }

    /**
     * Gets the value of the khasra property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKhasra() {
        return khasra;
    }

    /**
     * Sets the value of the khasra property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKhasra(String value) {
        this.khasra = value;
    }

}
