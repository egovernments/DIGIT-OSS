import Download from "../atoms/Download";
import { UploadServices } from "../atoms/UploadServices";
import UrlShortener from "../elements/UrlShortener";

const isMobileOrTablet = () => {
  return (/(android|iphone|ipad|mobile)/i.test(navigator.userAgent));
}

const ShareFiles = {
  targetLink: (target, shortUrl) => {
    switch (target) {
      case "mail":
        return window.open(`mailto:?body=${encodeURIComponent(shortUrl)}`, "_blank");
      case "whatsapp":
        return window.open('https://' + (isMobileOrTablet() ? 'api' : 'web') + '.whatsapp.com/send?text=' + encodeURIComponent(shortUrl), "_blank");
      default:
        return window.open(shortUrl, "_blank");
    }
  },

  getShortener: async (tenantId, data) => {
    const fileUploadId = await UploadServices.Filestorage("DSS", data, tenantId);
    const fileUrl = await UploadServices.Filefetch([fileUploadId.data.files[0].fileStoreId], fileUploadId.data.files[0].tenantId);
    return UrlShortener(Digit.Utils.getFileUrl(fileUrl.data[fileUploadId.data.files[0].fileStoreId]));
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
    return ShareFiles.targetLink(target, shortUrl);
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
    return ShareFiles.targetLink(target, shortUrl);
  },

  IndividualChartImage: async (tenantId, node, filename, target) => {
    const imageData = await new Promise((resolve) => Download.IndividualChartImage(node, filename, true, resolve));
    if (!target && navigator.share) {
      return navigator.share({
        files: [imageData],
        title: filename,
      });
    }
    const shortUrl = await ShareFiles.getShortener(tenantId, imageData);
    return ShareFiles.targetLink(target, shortUrl);
  },
  DownloadImage: async (tenantId, node, filename, target) => {
    const imageData = await new Promise((resolve) => Download.PDF(node, filename, true, resolve));
    if (!target && navigator.share) {
      return navigator.share({
        files: [imageData],
        title: filename,
      });
    }
    const shortUrl = await ShareFiles.getShortener(tenantId, imageData);
    return ShareFiles.targetLink(target, shortUrl);
  },
};

export default ShareFiles;
