
export async function loadSarabunFonts(pdfMake) {
  const loadFont = async (fileName) => {
    const res = await fetch(`/fonts/${fileName}`);
    const blob = await res.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        pdfMake.vfs[fileName] = base64;
        resolve();
      };
      reader.readAsDataURL(blob);
    });
  };

  await Promise.all([
    loadFont("Sarabun-Regular.ttf"),
    loadFont("Sarabun-Bold.ttf"),
    loadFont("Sarabun-Italic.ttf"),
    loadFont("Sarabun-BoldItalic.ttf"),
  ]);

  pdfMake.fonts = {
    THSarabun: {
      normal: "Sarabun-Regular.ttf",
      bold: "Sarabun-Bold.ttf",
      italics: "Sarabun-Italic.ttf",
      bolditalics: "Sarabun-BoldItalic.ttf",
    },
  };
}
