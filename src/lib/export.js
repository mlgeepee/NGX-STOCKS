function escapeCsvValue(value) {
  if (value == null) {
    return "";
  }

  const normalized = String(value).replace(/\r?\n|\r/g, " ").trim();

  if (/[",]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
}

function downloadTextFile(filename, content, mimeType) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export function buildExportFileName(prefix, suffix = "csv") {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);

  return `${prefix}-${timestamp}.${suffix}`;
}

export function downloadCsvFile(filename, rows = []) {
  if (!Array.isArray(rows) || !rows.length) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(","),
    ),
  ];

  downloadTextFile(filename, lines.join("\n"), "text/csv;charset=utf-8;");
}
