import XLSX from "xlsx";

export default function deckExporter(cards, squads, deckName, documentType) {
  var wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "Edge Dawnfall Deck - " + deckName,
    CreatedDate: Date.now(),
  };

  wb.SheetNames.push("Squads");

  var squadData = [["Squad", "Count"]];
  squads.forEach((s) => {
    if (s.count > 0) {
      squadData.push([s.name, s.count]);
    }
  });
  var squadSheet = XLSX.utils.aoa_to_sheet(squadData);
  wb.Sheets["Squads"] = squadSheet;

  wb.SheetNames.push("Cards");

  var ws_data = [["Cards", "Count"]];
  cards.forEach((c) => {
    if (c.count > 0) {
      ws_data.push([c.lowerAction, c.count]);
    }
  });
  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Cards"] = ws;

  var wbout = XLSX.write(wb, { bookType: documentType, type: "binary" });
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  return {
    blob: new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    fileName: deckName + "." + documentType,
  };
}
