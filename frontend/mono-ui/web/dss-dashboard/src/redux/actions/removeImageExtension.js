export default function removeImageExtension(fileArr) {
	let image = '';
	fileArr.map(fileData => {
		if (!fileData.includes('small.jpeg') && !fileData.includes('medium.jpeg') && !fileData.includes('large.jpeg')) {
			image = fileData
		}
	})

	return image;
}