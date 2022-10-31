
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
 *         &lt;element name="GetSegmentsFromTehsilResult" minOccurs="0"&gt;
 *           &lt;complexType&gt;
 *             &lt;complexContent&gt;
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *                 &lt;sequence&gt;
 *                 &lt;/sequence&gt;
 *               &lt;/restriction&gt;
 *             &lt;/complexContent&gt;
 *           &lt;/complexType&gt;
 *         &lt;/element&gt;
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
    "getSegmentsFromTehsilResult"
})
@XmlRootElement(name = "GetSegmentsFromTehsilResponse")
public class GetSegmentsFromTehsilResponse {

    @XmlElement(name = "GetSegmentsFromTehsilResult")
    protected GetSegmentsFromTehsilResponse.GetSegmentsFromTehsilResult getSegmentsFromTehsilResult;

    /**
     * Gets the value of the getSegmentsFromTehsilResult property.
     * 
     * @return
     *     possible object is
     *     {@link GetSegmentsFromTehsilResponse.GetSegmentsFromTehsilResult }
     *     
     */
    public GetSegmentsFromTehsilResponse.GetSegmentsFromTehsilResult getGetSegmentsFromTehsilResult() {
        return getSegmentsFromTehsilResult;
    }

    /**
     * Sets the value of the getSegmentsFromTehsilResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link GetSegmentsFromTehsilResponse.GetSegmentsFromTehsilResult }
     *     
     */
    public void setGetSegmentsFromTehsilResult(GetSegmentsFromTehsilResponse.GetSegmentsFromTehsilResult value) {
        this.getSegmentsFromTehsilResult = value;
    }


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
     *       &lt;/sequence&gt;
     *     &lt;/restriction&gt;
     *   &lt;/complexContent&gt;
     * &lt;/complexType&gt;
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "")
    public static class GetSegmentsFromTehsilResult {


    }

}
