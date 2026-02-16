function simplePdfFromText(title: string, text: string) {
  const safe = text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const content = `BT /F1 11 Tf 50 760 Td (${title}) Tj 0 -24 Td (${safe.slice(0, 2500)}) Tj ET`;
  const stream = Buffer.from(content, "latin1");
  const objects = [
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Page /Parent 4 0 R /Resources << /Font << /F1 1 0 R >> >> /MediaBox [0 0 612 792] /Contents 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Catalog /Pages 4 0 R >>",
  ];
  let output = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, i) => {
    offsets.push(output.length);
    output += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefPos = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((off) => (output += `${String(off).padStart(10, "0")} 00000 n \n`));
  output += `trailer\n<< /Size ${objects.length + 1} /Root 5 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(output, "latin1");
}

export async function renderPdf(html: string, fileNameForLogs: string) {
  try {
    type Browser = { newPage: () => Promise<{ setContent: (html: string, opts: { waitUntil: string }) => Promise<void>; pdf: (opts: { format: string; printBackground: boolean; preferCSSPageSize: boolean }) => Promise<Uint8Array>; }>; close: () => Promise<void> };
    type PlaywrightModule = { chromium: { launch: (opts: { headless: boolean; args: string[] }) => Promise<Browser> } };
    const importPlaywright = new Function("return import(\"playwright\")") as () => Promise<unknown>;
    const playwright = (await importPlaywright()) as PlaywrightModule;
    const browser = await playwright.chromium.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    await browser.close();
    return Buffer.from(pdf);
  } catch {
    return simplePdfFromText(fileNameForLogs, "Playwright renderer unavailable at runtime. Fallback PDF generated.");
  }
}
