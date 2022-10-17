
package org.jamabandi;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
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
 *         &lt;element name="propertyid" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="mcid" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "propertyid",
    "mcid"
})
@XmlRootElement(name = "GetCompleteULBPropertyDueByID")
public class GetCompleteULBPropertyDueByID {

    protected String propertyid;
    protected String mcid;

    /**
     * Gets the value of the propertyid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPropertyid() {
        return propertyid;
    }

    /**
     * Sets the value of the propertyid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPropertyid(String value) {
        this.propertyid = value;
    }

    /**
     * Gets the value of the mcid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMcid() {
        return mcid;
    }

    /**
     * Sets the value of the mcid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMcid(String value) {
        this.mcid = value;
    }

}
