import XLSX from "xlsx";

export default function deckExporter(
  cards,
  squads,
  deckName,
  selectedBanner,
  selectedSquad,
  documentType
) {
  var wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "Edge Dawnfall Deck - " + deckName,
    CreatedDate: Date.now(),
  };
  wb.SheetNames.push("BannerAndShrine");
  let basData = [
    ["Banner", "Shrine"],
    [selectedBanner, selectedSquad],
  ];

  let basSheet = XLSX.utils.aoa_to_sheet(basData);
  wb.Sheets["BannerAndShrine"] = basSheet;
  wb.SheetNames.push("Squads");

  let squadData = [["Squad", "Count"]];
  squads.forEach((s) => {
    if (s.count > 0) {
      squadData.push([s.name, s.count]);
    }
  });
  let squadSheet = XLSX.utils.aoa_to_sheet(squadData);
  wb.Sheets["Squads"] = squadSheet;

  wb.SheetNames.push("Cards");

  let ws_data = [["Cards", "Count"]];
  cards.forEach((c) => {
    if (c.count > 0) {
      ws_data.push([c.lowerAction, c.count]);
    }
  });
  let ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Cards"] = ws;

  let wbout = XLSX.write(wb, { bookType: documentType, type: "binary" });
  function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  return {
    blob: new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    fileName: deckName + "." + documentType,
  };
}
