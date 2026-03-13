import { describe, expect, it } from "vitest";

import {
  applySelectionCount,
  buildDeckStateForFaction,
  buildSavedDeck,
  findFaction,
  getInitialFaction,
  hydrateSavedDeck,
  hydrateSharedDeck,
  mergeSavedDecks,
  upsertSavedDeck,
} from "./domain";

describe("deck domain", () => {
  it("merges default decks into parsed decks without duplicating ids", () => {
    const merged = mergeSavedDecks([]);

    expect(merged.some((deck) => deck.id === 0)).toBe(true);
    expect(merged.filter((deck) => deck.id === 0)).toHaveLength(1);
  });

  it("hydrates a saved deck into faction-specific card and squad state", () => {
    const hydrated = hydrateSavedDeck({
      id: "test",
      name: "Saved",
      faction: "chapter",
      cards: [1, 1, 3],
      squads: [4, 4, 6],
      selectedBanner: "regular",
      selectedShrine: "regular",
    });

    expect(hydrated).not.toBeNull();
    expect(hydrated?.selectedFaction.type).toBe("chapter");
    expect(hydrated?.selectedCards.find((card) => card.id === 1)?.count).toBe(2);
    expect(hydrated?.selectedSquads.find((squad) => squad.id === 4)?.count).toBe(2);
    expect(hydrated?.deckName).toBe("Saved");
  });

  it("hydrates a shared deck only when faction and ids are valid", () => {
    const hydrated = hydrateSharedDeck({
      factionType: "chapter",
      cardIds: [1, 3],
      squadIds: [4, 6],
      deckName: "Shared",
    });

    expect(hydrated).not.toBeNull();
    expect(hydrated?.deckName).toBe("Shared");
    expect(hydrated?.selectedCards.filter((card) => card.count > 0)).toHaveLength(2);
  });

  it("builds and upserts saved decks from deck state", () => {
    const initialFaction = getInitialFaction();
    const state = buildDeckStateForFaction(initialFaction, "deck-1");
    const cards = applySelectionCount(state.selectedCards, 1, "add");
    const squads = applySelectionCount(state.selectedSquads, 4, "add");
    const savedDeck = buildSavedDeck({
      ...state,
      deckName: "My deck",
      selectedCards: cards,
      selectedSquads: squads,
    });

    expect(savedDeck).not.toBeNull();

    const savedDecks = upsertSavedDeck([], savedDeck!);
    const updatedDecks = upsertSavedDeck(savedDecks, {
      ...savedDeck!,
      name: "Updated",
    });

    expect(savedDecks).toHaveLength(1);
    expect(updatedDecks).toHaveLength(1);
    expect(updatedDecks[0]?.name).toBe("Updated");
  });

  it("finds known factions and rejects unknown ones", () => {
    expect(findFaction("chapter")?.type).toBe("chapter");
    expect(findFaction("missing")).toBeNull();
  });
});
