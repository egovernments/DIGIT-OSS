package org.egov.edcr.Util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class DXFHelper {
	public static void main(String[] args) {
		DXFHelper rc = new DXFHelper();
		String filePath = "/home/mani/Workspaces/bpa/eGov-Kozhikode-Implementation/egov/egov-edcr/src/test/resources/Sanity.dxf";
		//rc.getContents("AcDbEntity", "AcDbEntity", "BLK_1_LVL_0", filePath);
		rc.getContents("LWPOLYLINE",  "BLK_1_LVL_0", filePath ,"LWPOLYLINE","MTEXT","LINE");
	}

	public List<String> getContents(String start, String having, String filePath,String ...end2 ) {
		List<String> result = new ArrayList<>();
		List<String> end=new ArrayList<>();
	    for(String s:end2)
	    {
	    	end.add(s);
	    }
		try {
			int i = 0;
			File f = new File(filePath);
			String fileAsString = null;
			InputStream is = new FileInputStream(filePath);
			BufferedReader buf = new BufferedReader(new InputStreamReader(is));
			String line = buf.readLine();
			StringBuilder sb = new StringBuilder();
			File fout = new File(
					"/home/mani/Workspaces/bpa/eGov-Kozhikode-Implementation/egov/egov-edcr/src/test/resources/o.txt");
			if (fout.exists())
				fout.delete();
			FileWriter rt = new FileWriter(fout);
			while (line != null) {
				/*
				 * if(line.contains(having)) { System.out.println(line); }
				 */
				if (line.equals(start)) {
					sb = new StringBuilder();
					sb.append(line).append("\n");
					line = buf.readLine();
					// System.out.println(line+" -----"+i++);
					while (line != null && !end.toString().contains(line)) {
						// System.out.println(line+" "+i);
						sb.append(line).append("\n");
						line = buf.readLine();
						if (line != null && end.toString().contains(line)) {
							System.out.println(line +"   "+end.toString());
						}
					}
					// rt.write(sb.toString()+"
					// &&&&&&&&&&&"+sb.toString().contains(having));
					if (sb.toString().contains(having)) {
						result.add(sb.toString());
						System.out.println("******************found " + i++);
					}
				}else
				line = buf.readLine();
			}

			// line = buf.readLine();

			is.close();
			// fileAsString = sb.toString();
			// System.out.println("Contents : " + fileAsString);

			for (String s : result)
				rt.write(s);
			rt.flush();

			rt.close();

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;

	}
}
