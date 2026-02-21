import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadPdfOptions {
  elementId: string;
  filename?: string;
  title?: string;
  userName?: string;
}

export async function downloadDashboardPdf({
  elementId,
  filename = "Dashboard_Report.pdf",
  title = "Dashboard Analysis Report",
  userName,
}: DownloadPdfOptions): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#0a0a0f",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;
  const headerHeight = 30;
  const contentWidth = pageWidth - margin * 2;

  pdf.setFillColor(10, 10, 15);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  pdf.setTextColor(0, 212, 255);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, margin, 18);

  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  pdf.text(`Generated on: ${dateStr}`, margin, 25);

  if (userName) {
    pdf.text(`User: ${userName}`, pageWidth - margin - 50, 25);
  }

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let yPosition = headerHeight;
  let remainingHeight = imgHeight;
  let sourceY = 0;

  const availableHeight = pageHeight - headerHeight - margin;

  while (remainingHeight > 0) {
    const sliceHeight = Math.min(remainingHeight, availableHeight);
    const sourceHeight = (sliceHeight / imgHeight) * canvas.height;

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sourceHeight;

    const ctx = sliceCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight
      );

      const sliceImgData = sliceCanvas.toDataURL("image/png");
      pdf.addImage(sliceImgData, "PNG", margin, yPosition, imgWidth, sliceHeight);
    }

    remainingHeight -= sliceHeight;
    sourceY += sourceHeight;

    if (remainingHeight > 0) {
      pdf.addPage();
      pdf.setFillColor(10, 10, 15);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      yPosition = margin;
    }
  }

  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
    pdf.text(
      "Learn Sync - AI-Powered Learning Intelligence",
      margin,
      pageHeight - 5
    );
  }

  pdf.save(filename);
}
