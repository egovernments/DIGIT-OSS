package org.egov.edcr.Util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

public class DXFHelper {
	private static final Logger LOG = Logger.getLogger(DXFHelper.class);
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
		try (InputStream is = new FileInputStream(filePath);
				BufferedReader buf = new BufferedReader(new InputStreamReader(is));) {
			int i = 0;
			File f = new File(filePath);
			String fileAsString = null;
			
			String line = buf.readLine();
			StringBuilder sb = new StringBuilder();
			File fout = new File(
					"/home/mani/Workspaces/bpa/eGov-Kozhikode-Implementation/egov/egov-edcr/src/test/resources/o.txt");
			if (fout.exists())
				fout.delete();
			FileWriter rt = new FileWriter(fout);
			while (line != null) {
				/*
				 * if(line.contains(having)) { LOG.info(line); }
				 */
				if (line.equals(start)) {
					sb = new StringBuilder();
					sb.append(line).append("\n");
					line = buf.readLine();
					// LOG.info(line+" -----"+i++);
					while (line != null && !end.toString().contains(line)) {
						// LOG.info(line+" "+i);
						sb.append(line).append("\n");
						line = buf.readLine();
						if (line != null && end.toString().contains(line)) {
							LOG.info(line +"   "+end.toString());
						}
					}
					// rt.write(sb.toString()+"
					// &&&&&&&&&&&"+sb.toString().contains(having));
					if (sb.toString().contains(having)) {
						result.add(sb.toString());
						LOG.info("******************found " + i++);
					}
				}else
				line = buf.readLine();
			}

			// line = buf.readLine();

			is.close();
			// fileAsString = sb.toString();
			// LOG.info("Contents : " + fileAsString);

			for (String s : result)
				rt.write(s);
			rt.flush();

			rt.close();

		} catch (IOException e) {
			LOG.error(e.getMessage());
		}
		return result;

	}
}
