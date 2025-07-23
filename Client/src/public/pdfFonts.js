import pdfMake from "pdfmake/build/pdfmake";
import { sarabunVfs } from "./SarabunFonts";

pdfMake.vfs = sarabunVfs;

pdfMake.fonts = {
  THSarabun: {
    normal: "Sarabun-Regular.ttf",
    bold: "Sarabun-Bold.ttf",
    italics: "Sarabun-Italic.ttf",
    bolditalics: "Sarabun-BoldItalic.ttf",
  },
};

export default pdfMake;
