
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
 *         &lt;element name="GetKhatonisResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getKhatonisResult"
})
@XmlRootElement(name = "GetKhatonisResponse")
public class GetKhatonisResponse {

    @XmlElement(name = "GetKhatonisResult")
    protected String getKhatonisResult;

    /**
     * Gets the value of the getKhatonisResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetKhatonisResult() {
        return getKhatonisResult;
    }

    /**
     * Sets the value of the getKhatonisResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetKhatonisResult(String value) {
        this.getKhatonisResult = value;
    }

}
