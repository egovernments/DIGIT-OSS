import apistatus from './apistatus/apistatus';
import firstReducer from './firstReducer';
import globalfilter from './globalFilter/globalFilterReducer';
import DemandAndCollectionData from './demandAndCollection/dncReducer';
import GFilterData from './globalFilter/gDataReducer';
import chartsData from './ChartsR/chartsReduser';
import language from './language/languageReducer';
import s3File from './fileUpload/fileUpload'
import s3FileMobile from './fileUpload/fileUploadMobile'
import s3FileCard from './fileUpload/fileUploadCard'
import s3Image from './s3Image/s3Image';
import s3ImageMobile from './s3Image/s3ImageMobile';
import s3ImageCard from './s3Image/s3ImageCard';
import mdmsData from './mdms/mdms';
import ulbFilters from './ulbsReducer';
import tenents from './tenent/tenent';
import wards from './tenent/ward';
import ulbOverViewFilters from './ulbOverviewFilter'

export default {
    apistatus: apistatus,
    firstReducer: firstReducer,
    globalFilter: globalfilter,
    DemandAndCollectionData: DemandAndCollectionData,
    GFilterData: GFilterData,
    chartsData: chartsData,
    lang: language,
    s3File: s3File,
    s3FileMobile: s3FileMobile,
    s3FileCard: s3FileCard,
    s3Image: s3Image,
    s3ImageMobile: s3ImageMobile,
    s3ImageCard: s3ImageCard,
    mdmsData: mdmsData,
    ulbFilters: ulbFilters,
    tenents: tenents,
    wards: wards,
    ulbOverViewFilters: ulbOverViewFilters,
}