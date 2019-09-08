package org.egov.filestore.persistence.repository;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.imgscalr.Scalr;
import org.imgscalr.Scalr.Method;
import org.imgscalr.Scalr.Mode;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FileRepository {

	public void write(MultipartFile file, Path path) {
		writeToFileSystem(file, path);
	}

	private void writeToFileSystem(MultipartFile file, Path path) {

		try {
			FileUtils.forceMkdirParent(path.toFile());

			if (file.getContentType().startsWith("image/")) {
				// generate thumbnails
				log.debug("its an image");
				writeImage(file, path);
			} else {
				log.debug("its other format");
				file.transferTo(path.toFile());
			}
			log.info("Successfully wrote file to disk. " + "File name: " + file.getOriginalFilename() + " File Size: "
					+ file.getSize());
		} catch (IOException e) {
			log.error(" exception occured while write file ",e);
			throw new RuntimeException(e);
		}
	}

	private void writeImage(MultipartFile file, Path path) {

		try {
			BufferedImage originalImage = ImageIO.read(file.getInputStream());
			BufferedImage mediumImg = Scalr.resize(originalImage, Method.QUALITY, Mode.AUTOMATIC, 75, 75,
					Scalr.OP_ANTIALIAS);
			BufferedImage smallImg = Scalr.resize(originalImage, Method.QUALITY, Mode.AUTOMATIC, 50, 50,
					Scalr.OP_ANTIALIAS);
			
			String originalPath = path.toFile().toString();
			int lastIndex = originalPath.length();
			String replaceString = originalPath.substring(originalPath.lastIndexOf('.'), lastIndex);
			String extension = originalPath.substring(lastIndex-3,lastIndex);
			String mediumPath = path.toFile().toString().replace(replaceString, "_medium"+replaceString);
			String smallPath = path.toFile().toString().replace(replaceString, "_small"+replaceString);

			// or write to a file 
			File f2 = new File(path.toFile().toString());
			ImageIO.write(originalImage, extension, f2);
			
			log.info(" the medium path : {}", mediumPath);
			File f3 = new File(mediumPath);
			ImageIO.write(mediumImg, extension, f3);
			
			log.info(" the small path : {}", smallPath);
			File f = new File(smallPath);
			ImageIO.write(smallImg, extension, f);
			
		} catch (IOException ioe) {
			log.error("IO exception occurred while trying to read image.");
			throw new RuntimeException(ioe);
		}
	}

	public Resource read(Path path) {
		return new FileSystemResource(path.toFile());
	}
}