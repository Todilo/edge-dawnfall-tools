import { beforeEach, describe, expect, it, vi } from "vitest";

import { getInitialFaction } from "../deck/domain";
import { useDeckStore } from "./deck-store";

const storage = new Map<string, string>();

const localStorageMock = {
  getItem: vi.fn((key: string) => storage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => {
    storage.set(key, value);
  }),
  removeItem: vi.fn((key: string) => {
    storage.delete(key);
  }),
  clear: vi.fn(() => {
    storage.clear();
  }),
};

beforeEach(() => {
  storage.clear();
  vi.clearAllMocks();
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    configurable: true,
  });
  useDeckStore.setState((state) => ({
    ...state,
    selectedFaction: getInitialFaction(),
    selectedCards: [],
    selectedSquads: [],
    savedDecks: [],
    alertMessages: [],
    deckName: "New deck",
    selectedBanner: "regular",
    selectedShrine: "regular",
    deckId: "test-deck",
  }));
});

describe("deck store", () => {
  it("initializes saved decks from storage and merges defaults", () => {
    storage.set(
      "savedDecks",
      JSON.stringify([
        {
          id: "custom",
          name: "Custom",
          faction: "chapter",
          cards: [1],
          squads: [4],
          selectedBanner: "regular",
          selectedShrine: "regular",
        },
      ])
    );

    useDeckStore.getState().initialize();

    const savedDecks = useDeckStore.getState().savedDecks;
    expect(savedDecks.some((deck) => deck.id === "custom")).toBe(true);
    expect(savedDecks.some((deck) => deck.id === 0)).toBe(true);
  });

  it("saves and reloads a deck through store actions", () => {
    useDeckStore.setState((state) => ({
      ...state,
      selectedCards: state.selectedCards.length
        ? state.selectedCards
        : useDeckStore.getState().selectedCards,
    }));
    useDeckStore.getState().resetDeck("chapter");
    useDeckStore.getState().addCard(1);
    useDeckStore.getState().addSquad(4);
    useDeckStore.getState().setDeckName("Store deck");

    const saveResult = useDeckStore.getState().saveDeck("store-deck");
    expect(saveResult.ok).toBe(true);

    const loadResult = useDeckStore.getState().loadDeck("store-deck");
    expect(loadResult).toBe(true);
    expect(useDeckStore.getState().deckName).toBe("Store deck");
    expect(
      useDeckStore.getState().selectedCards.find((card) => card.id === 1)?.count
    ).toBe(1);
  });

  it("hydrates a shared deck through the store action", () => {
    const result = useDeckStore.getState().loadSharedDeck({
      factionType: "chapter",
      cardIds: [1, 3],
      squadIds: [4, 6],
      deckName: "Shared",
    });

    expect(result).toBe(true);
    expect(useDeckStore.getState().deckName).toBe("Shared");
    expect(useDeckStore.getState().selectedFaction.type).toBe("chapter");
  });
});
