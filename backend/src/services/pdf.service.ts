import PDFDocument from "pdfkit";

function renderToBuffer(render: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
        render(doc);
        doc.end();
    });
}

export function generateProcurementReportPdf(procurement: any, printerNames: Map<string, string>): Promise<Buffer> {
    return renderToBuffer((doc) => {
        doc.fontSize(18).text("Printing House - Izveštaj o javnoj nabavci", { align: "center" });
        doc.moveDown();
        doc.fontSize(10);
        doc.text(`Broj nabavke: ${procurement._id}`);
        doc.text(`Datum raspisivanja: ${new Date(procurement.createdAt).toLocaleString("sr-RS")}`);
        doc.text(`Rok: ${new Date(procurement.deadline).toLocaleString("sr-RS")}`);
        doc.moveDown();

        doc.fontSize(12).text("Traženi proizvodi:");
        procurement.items.forEach((item: any) => {
            doc.fontSize(10).text(`${item.naziv} (${item.kategorija}) - ${item.kolicina} kom`);
        });

        doc.moveDown();
        doc.fontSize(12).text("Pristigle ponude:");
        procurement.bids.forEach((bid: any) => {
            const name = printerNames.get(bid.printerId.toString()) || bid.printerId.toString();
            const winner = procurement.winningPrinterId && procurement.winningPrinterId.toString() === bid.printerId.toString();
            doc.fontSize(10).text(`${name} - ukupno ${bid.ukupnaCena} din ${winner ? " (POBEDNIK)" : ""}`);
        });

        if (!procurement.bids.length) {
            doc.fontSize(10).text("Nije bilo pristiglih ponuda.");
        }
    });
}
