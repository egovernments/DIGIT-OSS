
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
 *         &lt;element name="GetVillages3Result" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getVillages3Result"
})
@XmlRootElement(name = "GetVillages3Response")
public class GetVillages3Response {

    @XmlElement(name = "GetVillages3Result")
    protected String getVillages3Result;

    /**
     * Gets the value of the getVillages3Result property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetVillages3Result() {
        return getVillages3Result;
    }

    /**
     * Sets the value of the getVillages3Result property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetVillages3Result(String value) {
        this.getVillages3Result = value;
    }

}
