import PDFDocument from "pdfkit";
import moment from "moment";
import path from "path";
import ExportFileService from "../services/exportFile.service.js";

// ระบุ path ให้ตรงกับโครงสร้างจริงของโปรเจค
const fontSarabun = path.resolve("fonts/THSarabunNew.ttf");
const fontSarabunBold = path.resolve("fonts/THSarabunNew Bold.ttf");

const getGradStatus = (status) => {
  if (status === 1) return "สำเร็จ";
  if (status === 0) return "ไม่สำเร็จ";
  return "-";
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

      try {
        const doc = new PDFDocument({ margin: 36, size: "A4" });

        // Register THSarabunNew font
        doc.registerFont("sarabun", fontSarabun);
        doc.registerFont("sarabun-bold", fontSarabunBold);

        // ใช้ sarabun หรือ sarabun-bold กับทุก .text()
        doc.font("sarabun-bold").fontSize(22).text("รายงานข้อมูลนักศึกษา", { align: "center" });
        doc.moveDown();

        // Table header
        doc.font("sarabun-bold").fontSize(14).text(
          "ลำดับ | ปีการศึกษา | เทอม | รหัส | ชั้นปี | คำนำหน้า | ชื่อ | นามสกุล | GPA | สถานะ | สาขา",
          { underline: true }
        );
        doc.moveDown(0.4);
        doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
        doc.moveDown(0.2);

        students.forEach((s, i) => {
          doc.font("sarabun").fontSize(13).text(
            `${i + 1} | ${s.year_no ?? "-"} | ${s.semester_no ?? "-"} | ${s.student_no} | ${s.std_year_no ?? "-"} | ${s.prefix_name ?? "-"} | ${s.name ?? "-"} | ${s.lname ?? "-"} | ${s.gpa ?? "-"} | ${getGradStatus(s.status_graduate)} | ${s.curr_name ?? "-"}`
          );
        });

        doc.addPage();
        doc.moveDown(1.5).font("sarabun-bold").fontSize(16).text("รายละเอียดเพิ่มเติม");

        students.forEach((s, i) => {
          doc.moveDown(0.8);
          doc.font("sarabun-bold").fontSize(13).text(
            `ลำดับที่ ${i + 1} : ${s.prefix_name ?? ""}${s.name ?? ""} ${s.lname ?? ""} (${s.student_no})`
          );
          doc.font("sarabun").fontSize(13)
            .text(`ปีการศึกษา: ${s.year_no ?? "-"}   เทอม: ${s.semester_no ?? "-"}   ชั้นปี: ${s.std_year_no ?? "-"}`)
            .text(`GPA: ${s.gpa ?? "-"}   CCA: ${s.cca ?? "-"}`)
            .text(`สถานะการศึกษา: ${getGradStatus(s.status_graduate)}`)
            .text(`วันที่จบ: ${s.graduate_date ? moment(s.graduate_date).format("DD/MM/YYYY") : "-"}`)
            .text(`ปริญญา: ${s.deg_name ?? "-"}`)
            .text(`เกียรตินิยม: ${s.honors ?? "-"}`)
            .text(`หัวข้อวิทยานิพนธ์ (TH): ${s.thesis_topic_th ?? "-"}`)
            .text(`หัวข้อวิทยานิพนธ์ (EN): ${s.thesis_topic_en ?? "-"}`)
            .text(`รหัสแผนก: ${s.dept_code ?? "-"}`)
            .text(`ชื่อหลักสูตร: ${s.curr_name ?? "-"}`);
          doc.moveDown(0.4);
          doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor("#cccccc").stroke();
        });

        let buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers);
          res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="student_export.pdf"`,
          }).send(pdfData);
        });

        doc.end();
      } catch (pdfError) {
        console.error("PDFKit error:", pdfError);
        return res.status(500).json({ message: "Export PDF failed" });
      }
    } catch (error) {
      console.error("Controller error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default ExportFileController;
