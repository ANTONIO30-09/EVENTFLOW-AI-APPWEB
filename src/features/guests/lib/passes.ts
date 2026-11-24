import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Guest } from "../types";

export const guestQrValue = (id: string) => `eventflow:guest:${id}`;

export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export const peopleLabel = (companions: number) => {
  const total = 1 + (companions || 0);
  return `Pase para ${total} ${total === 1 ? "persona" : "personas"}`;
};

export const exportPassesPdf = async (eventName: string, guests: Guest[]) => {
  const list = guests.filter((g) => g.id);
  if (list.length === 0) return;

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const cols = 3;
  const rows = 4;
  const cellW = 63;
  const cellH = 68;
  const marginX = (210 - cols * cellW) / 2;
  const marginY = (297 - rows * cellH) / 2;
  const perPage = cols * rows;

  for (let i = 0; i < list.length; i++) {
    const guest = list[i];
    const url = await QRCode.toDataURL(guestQrValue(guest.id as string), {
      width: 320,
      margin: 1,
      errorCorrectionLevel: "M",
    });
    const pos = i % perPage;
    if (i > 0 && pos === 0) pdf.addPage();
    const x = marginX + (pos % cols) * cellW;
    const y = marginY + Math.floor(pos / cols) * cellH;

    pdf.setDrawColor(190);
    pdf.rect(x, y, cellW, cellH);
    pdf.addImage(url, "PNG", x + 11.5, y + 4, 40, 40);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text(guest.name, x + cellW / 2, y + 50, { align: "center", maxWidth: cellW - 6 });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(peopleLabel(guest.companions), x + cellW / 2, y + 60, { align: "center" });
    pdf.setFontSize(6);
    pdf.text(eventName, x + cellW / 2, y + 65, { align: "center", maxWidth: cellW - 6 });
  }

  pdf.save(`pases-${slugify(eventName) || "evento"}.pdf`);
};
