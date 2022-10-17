
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
 *         &lt;element name="GetKhasraListByKhewatOnline2Result" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getKhasraListByKhewatOnline2Result"
})
@XmlRootElement(name = "GetKhasraListByKhewatOnline2Response")
public class GetKhasraListByKhewatOnline2Response {

    @XmlElement(name = "GetKhasraListByKhewatOnline2Result")
    protected String getKhasraListByKhewatOnline2Result;

    /**
     * Gets the value of the getKhasraListByKhewatOnline2Result property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetKhasraListByKhewatOnline2Result() {
        return getKhasraListByKhewatOnline2Result;
    }

    /**
     * Sets the value of the getKhasraListByKhewatOnline2Result property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetKhasraListByKhewatOnline2Result(String value) {
        this.getKhasraListByKhewatOnline2Result = value;
    }

}
