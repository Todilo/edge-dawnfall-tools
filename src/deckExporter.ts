import * as XLSX from "xlsx";

import type { Card, Squad } from "./types";

type ExportDocumentType = "ods" | "xlsx";

interface DeckExportResult {
  blob: Blob;
  fileName: string;
}

export default function deckExporter(
  cards: Card[],
  squads: Squad[],
  deckName: string,
  selectedBanner: string,
  selectedShrine: string,
  documentType: ExportDocumentType
): DeckExportResult {
  const workbook = XLSX.utils.book_new();
  workbook.Props = {
    Title: `Edge Dawnfall Deck - ${deckName}`,
    CreatedDate: new Date(),
  };

  workbook.SheetNames.push("BannerAndShrine");
  workbook.Sheets.BannerAndShrine = XLSX.utils.aoa_to_sheet([
    ["Banner", "Shrine"],
    [selectedBanner, selectedShrine],
  ]);

  workbook.SheetNames.push("Squads");
  workbook.Sheets.Squads = XLSX.utils.aoa_to_sheet([
    ["Squad", "Count"],
    ...squads
      .filter((squad) => squad.count > 0)
      .map((squad) => [squad.name, squad.count]),
  ]);

  workbook.SheetNames.push("Cards");
  workbook.Sheets.Cards = XLSX.utils.aoa_to_sheet([
    ["Cards", "Count"],
    ...cards
      .filter((card) => card.count > 0)
      .map((card) => [card.lowerAction, card.count]),
  ]);

  const workbookOutput = XLSX.write(workbook, {
    bookType: documentType,
    type: "binary",
  });

  const buffer = new ArrayBuffer(workbookOutput.length);
  const view = new Uint8Array(buffer);

  for (let index = 0; index < workbookOutput.length; index += 1) {
    view[index] = workbookOutput.charCodeAt(index) & 0xff;
  }

  return {
    blob: new Blob([buffer], { type: "application/octet-stream" }),
    fileName: `${deckName}.${documentType}`,
  };
}
