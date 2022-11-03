
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
 *         &lt;element name="GetAreaUnitsByVillageResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getAreaUnitsByVillageResult"
})
@XmlRootElement(name = "GetAreaUnitsByVillageResponse")
public class GetAreaUnitsByVillageResponse {

    @XmlElement(name = "GetAreaUnitsByVillageResult")
    protected String getAreaUnitsByVillageResult;

    /**
     * Gets the value of the getAreaUnitsByVillageResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetAreaUnitsByVillageResult() {
        return getAreaUnitsByVillageResult;
    }

    /**
     * Sets the value of the getAreaUnitsByVillageResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetAreaUnitsByVillageResult(String value) {
        this.getAreaUnitsByVillageResult = value;
    }

}
