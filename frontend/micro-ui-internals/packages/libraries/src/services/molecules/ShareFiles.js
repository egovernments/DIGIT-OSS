import Download from "../atoms/Download";
import { UploadServices } from "../atoms/UploadServices";
import UrlShortener from "../elements/UrlShortener";

const ShareFiles = {
  targetLink: (target, shortUrl) => {
    switch (target) {
      case "mail":
        return window.open(`mailto:?body=${shortUrl}`, "_blank");
      case "whatsapp":
        return window.open(`https://web.whatsapp.com/send?text=${shortUrl}`, "_blank");
      default:
        return window.open(shortUrl, "_blank");
    }
  },

  getShortener: async (tenantId, data) => {
    const fileUploadId = await UploadServices.Filestorage("DSS", data, tenantId);
    const fileUrl = await UploadServices.Filefetch([fileUploadId.data.files[0].fileStoreId], fileUploadId.data.files[0].tenantId);
    // console.log("fileUploadId", fileUploadId, fileUrl)
    return UrlShortener(fileUrl.data[fileUploadId.data.files[0].fileStoreId].split(",")[0]);
  },

  PDF: async (tenantId, node, filename, target) => {
    const pdfData = await Download.PDF(node, filename, true);
    if (!target && navigator.share) {
      return navigator.share({
        files: [pdfData],
        title: filename,
      });
    }
    const shortUrl = await ShareFiles.getShortener(tenantId, pdfData);
    ShareFiles.targetLink(target, shortUrl);
  },

  Image: async (tenantId, node, filename, target) => {
    const imageData = await new Promise((resolve) => Download.Image(node, filename, true, resolve));
    if (!target && navigator.share) {
      return navigator.share({
        files: [imageData],
        title: filename,
      });
    }
    const shortUrl = await ShareFiles.getShortener(tenantId, imageData);
    ShareFiles.targetLink(target, shortUrl);
  },
};

export default ShareFiles;
