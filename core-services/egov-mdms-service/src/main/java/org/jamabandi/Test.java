package org.jamabandi;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		LRDataService service = new LRDataService();
		DocumentBuilderFactory dbf=DocumentBuilderFactory.newInstance();//
		DocumentBuilder db;
		try {
			db = dbf.newDocumentBuilder();
			ByteArrayInputStream is = new    ByteArrayInputStream(
					service.getLRDataServiceSoap().getDistrict("lrdata@9977hry#", "06").getBytes());
			Document doc= db.parse(is);
			
			System.out.println(doc.getDocumentElement().getElementsByTagName("Districts").getLength());
			
			NodeList nodeList = doc.getElementsByTagName("Districts"); 
			NodeList nodeList1=null;
			for (int i=0;i<nodeList.getLength();i++ )
			{
				nodeList1=nodeList.item(i).getChildNodes();
				
				for (int x=0;x<nodeList1.getLength();x++ )
				{
					System.out.print(nodeList1.item(x).getTextContent()+"\t");
				}
				System.out.println();
			}
			System.out.println(service.getLRDataServiceSoap().getDistrict("lrdata@9977hry#", "06"));
			System.out.println(service.getLRDataServiceSoap().getTehsil("lrdata@9977hry#", "06","01"));
			System.out.println(service.getLRDataServiceSoap().getVillages("lrdata@9977hry#", "06","01","001")); 
			System.out.println(service.getLRDataServiceSoap().getMurabaByNVCODE("lrdata@9977hry#","01","001","02786"));
			System.out.println(service.getLRDataServiceSoap().getKhasraListByNVCODE("lrdata@9977hry#","01","001","02786","34"));
			System.out.println(service.getLRDataServiceSoap().getOwnersbykhewatOnline("lrdata@9977hry#","01","001","02786","146"));
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		
	
		
		
	}

}
	