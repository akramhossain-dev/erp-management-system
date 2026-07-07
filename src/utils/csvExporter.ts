/**
 * csvExporter.ts — Standard production-ready CSV file exporter.
 *
 * Handles string cell escaping and characters encoding (UTF-8 BOM).
 */
export function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const escapeCell = (val: string) => {
    if (val === null || val === undefined) return '""';
    const escaped = val.toString().replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const csvContent = "\uFEFF" + [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
