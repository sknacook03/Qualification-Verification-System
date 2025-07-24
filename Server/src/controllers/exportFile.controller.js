import PdfPrinter from "pdfmake";
import ExcelJS from "exceljs";
import path from "path";
import ExportFileService from "../services/exportFile.service.js";

// ระบุ path ให้ตรงกับโครงสร้างจริงของโปรเจค
const fontSarabun = path.resolve("fonts/THSarabunNew.ttf");
const fontSarabunBold = path.resolve("fonts/THSarabunNew Bold.ttf");

const getGradStatus = (status) => {
  if (status === 1) return "สำเร็จการศึกษา";
  if (status === 0) return "กำลังศึกษา";
  return "ไม่ระบุสถานะ";
};

const facultyMap = {
  103: "คณะระบบรางและการขนส่ง",
  104: "คณะนวัตกรรมและเทคโนโลยีการเกษตร",
  15: "คณะบริหารธุรกิจ",
  16: "คณะวิทยาศาสตร์และศิลปศาสตร์",
  17: "คณะวิศวกรรมศาสตร์และเทคโนโลยี",
  18: "คณะสถาปัตยกรรมศาสตร์และศิลปกรรมสร้างสรรค์",
  19: "สถาบันสหสรรพศาสตร์",
};

const getFacultyName = (deptCode) => {
  const code = deptCode.toString();
  if (facultyMap[code.substring(0, 3)]) {
    return facultyMap[code.substring(0, 3)];
  }

  if (facultyMap[code.substring(0, 2)]) {
    return facultyMap[code.substring(0, 2)];
  }

  return "-";
};

const splitDegreeAndDepartment = (currName) => {
  const degree = currName.split("(")[0].trim();
  const match = currName.match(/\((.*?)\)/);
  const dept = match ? match[1].trim() : "";
  return { degree, dept };
};

const dateTimetoExport = () => {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // รูปแบบ DD-MM-YYYY
};

const ExportFileController = {
  exportStudentPDF: async (req, res) => {
    try {
      const { studentNos } = req.body;
      if (
        !studentNos ||
        !Array.isArray(studentNos) ||
        studentNos.length === 0
      ) {
        return res.status(400).json({ message: "No studentNos provided" });
      }

      let students;
      try {
        students = await ExportFileService.getStudentsByNos(studentNos);
      } catch (dbError) {
        return res.status(500).json({ message: "Database error" });
      }

      // Group ข้อมูล
      const grouped = {};
      students.forEach((s) => {
        const fac = getFacultyName(s.dept_code);
        const { degree, dept } = splitDegreeAndDepartment(s.curr_name);
        const year = s.year_no || "-";
        const sem = s.semester_no || "-";
        const std_year = s.std_year_no || "-";
        const status = getGradStatus(s.status_graduate);
        if (!grouped[fac]) grouped[fac] = {};
        if (!grouped[fac][dept]) grouped[fac][dept] = {};
        if (!grouped[fac][dept][degree]) grouped[fac][dept][degree] = {};
        if (!grouped[fac][dept][degree][year])
          grouped[fac][dept][degree][year] = {};
        if (!grouped[fac][dept][degree][year][sem])
          grouped[fac][dept][degree][year][sem] = {};
        if (!grouped[fac][dept][degree][year][sem][std_year])
          grouped[fac][dept][degree][year][sem][std_year] = {};
        if (!grouped[fac][dept][degree][year][sem][std_year][status])
          grouped[fac][dept][degree][year][sem][std_year][status] = [];
        grouped[fac][dept][degree][year][sem][std_year][status].push(s);
      });

      // Define fonts for pdfmake
      const fonts = {
        Sarabun: {
          normal: fontSarabun, // path to your Sarabun font file
          bold: fontSarabunBold, // path to your Sarabun Bold font file
        },
      };

      // Create printer with fonts
      const printer = new PdfPrinter(fonts);

      // Document content array
      const content = [];

      // --- Header ---
      content.push({
        image: "./images/logo_header.png",
        width: 35,
        height: 70,
        alignment: "center",
        margin: [0, 0, 0, 10],
      });

      content.push({
        text: "มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตนครราชสีมา",
        style: "header1",
        alignment: "center",
        margin: [0, 0, 0, 0],
      });

      content.push({
        text: "รายงานสรุปผลข้อมูลนักศึกษา",
        style: "header2",
        alignment: "center",
        margin: [0, 0, 0, 15],
      });

      // --- วนแต่ละกลุ่มแล้ว render กลุ่ม + table ---
      const maxRowsPerPage = 20;

      for (const [fac, depts] of Object.entries(grouped)) {
        for (const [dept, degrees] of Object.entries(depts)) {
          for (const [degree, years] of Object.entries(degrees)) {
            for (const [year, sems] of Object.entries(years)) {
              for (const [sem, std_years] of Object.entries(sems)) {
                for (const [std_year, statuss] of Object.entries(std_years)) {
                  for (const [status, studentsInGroup] of Object.entries(
                    statuss
                  )) {
                    const sectionTitle1 = `คณะ: ${fac} | สาขา: ${dept}`;
                    const sectionTitle2 = `วุฒิการศึกษา: ${degree} | ปีการศึกษา: ${year} | ภาคเรียนที่: ${sem} | ชั้นปี: ${std_year} | สถานะ: ${status}`;

                    // เตรียมข้อมูลตาราง
                    const rows = studentsInGroup.map((s, i) => [
                      { text: (i + 1).toString(), alignment: "center" },
                      { text: s.student_no ?? "-", alignment: "center" },
                      {
                        text: `${s.prefix_name ?? ""}${s.name ?? ""} ${s.lname ?? ""}`.trim(),
                        alignment: "left",
                      },
                      { text: s.gpa ?? "-", alignment: "center" },
                      { text: s.honors ?? "-", alignment: "left" },
                      { text: s.thesis_topic_th ?? "-", alignment: "left" },
                    ]);

                    // วนแบ่ง rows ทีละ maxRowsPerPage
                    for (let i = 0; i < rows.length; i += maxRowsPerPage) {
                      const rowsForPage = rows.slice(i, i + maxRowsPerPage);

                      // Section titles
                      content.push({
                        text: sectionTitle1,
                        style: "sectionTitle",
                        margin: [0, 10, 0, 0],
                      });

                      content.push({
                        text: sectionTitle2,
                        style: "sectionTitle",
                        margin: [0, 0, 0, 10],
                      });

                      // Table headers
                      const tableHeaders = [
                        {
                          text: "ลำดับ",
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: "รหัสนักศึกษา",
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: "ชื่อ - นามสกุล",
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: "GPA",
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: "เกียรตินิยม",
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: "หัวข้อวิทยานิพนธ์",
                          style: "tableHeader",
                          alignment: "center",
                        },
                      ];

                      // Create table
                      content.push({
                        table: {
                          headerRows: 1,
                          widths: [30, 85, 100, 35, 80, "*"], // '*' for remaining width
                          body: [tableHeaders, ...rowsForPage],
                        },
                        layout: {
                          hLineWidth: function (i, node) {
                            return 1.5;
                          },
                          vLineWidth: function (i, node) {
                            return 1.5;
                          },
                          hLineColor: function (i, node) {
                            return "#000";
                          },
                          vLineColor: function (i, node) {
                            return "#000";
                          },
                          paddingLeft: function (i, node) {
                            return 2;
                          },
                          paddingRight: function (i, node) {
                            return 2;
                          },
                          paddingTop: function (i, node) {
                            return 2;
                          },
                          paddingBottom: function (i, node) {
                            return 2;
                          },
                        },
                        style: "tableContent",
                        margin: [0, 0, 0, 10],
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Document definition
      const docDefinition = {
        content: content,
        defaultStyle: {
          font: "Sarabun",
          fontSize: 12,
        },
        styles: {
          header1: {
            fontSize: 20,
            bold: true,
            font: "Sarabun",
          },
          header2: {
            fontSize: 18,
            bold: true,
            font: "Sarabun",
          },
          sectionTitle: {
            fontSize: 16,
            font: "Sarabun",
          },
          tableHeader: {
            fontSize: 12,
            bold: true,
            font: "Sarabun",
          },
          tableContent: {
            fontSize: 12,
            font: "Sarabun",
          },
        },
        pageSize: "A4",
        pageMargins: [30, 50, 30, 50],
        footer: function (currentPage, pageCount) {
          return {
            text: `~ ${currentPage} ~`,
            alignment: "center",
            fontSize: 12,
            font: "Sarabun",
            color: "#333333",
            margin: [0, 0, 0, 30],
          };
        },
      };

      // Generate PDF
      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="student_export_${dateTimetoExport()}.pdf"`
      );

      // Pipe PDF to response
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      console.error("Export PDF Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  exportStudentExcel: async (req, res) => {
    try {
      const { studentNos } = req.body;
      if (
        !studentNos ||
        !Array.isArray(studentNos) ||
        studentNos.length === 0
      ) {
        return res.status(400).json({ message: "No studentNos provided" });
      }

      let students;
      try {
        students = await ExportFileService.getStudentsByNos(studentNos);
      } catch (dbError) {
        return res.status(500).json({ message: "Database error" });
      }

      // สร้าง workbook/worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Student Report");

      // Header (รองรับภาษาไทย)
      worksheet.addRow([
        "ลำดับ",
        "ปีการศึกษา",
        "เทอม",
        "รหัส",
        "ชั้นปี",
        "คำนำหน้า",
        "ชื่อ",
        "นามสกุล",
        "GPA",
        "CCA",
        "สถานะ",
        "สาขา",
        "เกียรตินิยม",
        "หัวข้อวิจัย (TH)",
        "หัวข้อวิจัย (EN)",
      ]);

      // Rows
      students.forEach((s, i) => {
        worksheet.addRow([
          i + 1,
          s.year_no ?? "-",
          s.semester_no ?? "-",
          s.student_no,
          s.std_year_no ?? "-",
          s.prefix_name ?? "-",
          s.name ?? "-",
          s.lname ?? "-",
          s.gpa ?? "-",
          s.cca ?? "-",
          getGradStatus(s.status_graduate),
          s.curr_name ?? "-",
          s.honors ?? "-",
          s.thesis_topic_th ?? "-",
          s.thesis_topic_en ?? "-",
        ]);
      });

      worksheet.columns.forEach((column) => {
        column.width = 15;
      });

      // ใส่ border ทุกเซลล์ในตาราง
      const totalRows = worksheet.rowCount;
      for (let i = 1; i <= totalRows; i++) {
        const row = worksheet.getRow(i);
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        });
      }

      // Style header
      worksheet.getRow(1).font = { bold: true, size: 12 };
      worksheet.getColumn("L").width = 60;
      worksheet.getColumn("N").width = 60;
      worksheet.getColumn("O").width = 60;

      // Export file buffer แล้วส่งให้ React
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="student_export_${dateTimetoExport()}.xlsx"`
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Export Excel error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default ExportFileController;
