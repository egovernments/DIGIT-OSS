
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
 *         &lt;element name="GetOwnersbykhewatOnlineResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getOwnersbykhewatOnlineResult"
})
@XmlRootElement(name = "GetOwnersbykhewatOnlineResponse")
public class GetOwnersbykhewatOnlineResponse {

    @XmlElement(name = "GetOwnersbykhewatOnlineResult")
    protected String getOwnersbykhewatOnlineResult;

    /**
     * Gets the value of the getOwnersbykhewatOnlineResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetOwnersbykhewatOnlineResult() {
        return getOwnersbykhewatOnlineResult;
    }

    /**
     * Sets the value of the getOwnersbykhewatOnlineResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetOwnersbykhewatOnlineResult(String value) {
        this.getOwnersbykhewatOnlineResult = value;
    }

}
