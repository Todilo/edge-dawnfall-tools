import { create } from "zustand";

import type {
  AlertMessage,
  Card,
  DeckActions,
  DeckId,
  Faction,
  SavedDeck,
  Squad,
} from "../types";
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
  type LoadSharedDeckArgs,
  type SaveDeckResult,
} from "../deck/domain";
import { STORAGE_KEY } from "../deck/constants";

function persistSavedDecks(savedDecks: SavedDeck[]) {
  if (savedDecks.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecks));
  }
}

interface DeckStoreState {
  selectedFaction: Faction;
  selectedSquads: Squad[];
  selectedCards: Card[];
  savedDecks: SavedDeck[];
  alertMessages: AlertMessage[];
  deckName: string;
  selectedBanner: string;
  selectedShrine: string;
  deckId: DeckId;
  initialize: () => void;
  loadSharedDeck: (args: LoadSharedDeckArgs) => boolean;
  saveDeck: (id?: DeckId) => SaveDeckResult;
  saveAsDeck: () => SaveDeckResult;
}

type DeckStore = DeckStoreState & DeckActions;

const initialFaction = getInitialFaction();

export const useDeckStore = create<DeckStore>((set, get) => ({
  ...buildDeckStateForFaction(initialFaction),
  savedDecks: [],
  initialize: () => {
    let parsedDecks: SavedDeck[] = [];

    try {
      const fromStorage = localStorage.getItem(STORAGE_KEY);
      parsedDecks = fromStorage ? (JSON.parse(fromStorage) as SavedDeck[]) : [];
    } catch {
      parsedDecks = [];
    }

    set((state) => ({
      ...state,
      savedDecks: mergeSavedDecks(parsedDecks),
    }));
  },
  setDeckName: (deckName) => {
    set({ deckName });
  },
  setBanner: (selectedBanner) => {
    set({ selectedBanner });
  },
  setShrine: (selectedShrine) => {
    set({ selectedShrine });
  },
  setAlertMessage: (caller, message) => {
    set((state) => {
      const existingMessage = state.alertMessages.find(
        (item) => item.caller === caller
      );

      if (!message) {
        return {
          alertMessages: state.alertMessages.filter(
            (item) => item.caller !== caller
          ),
        };
      }

      if (existingMessage?.message === message) {
        return state;
      }

      if (existingMessage) {
        return {
          alertMessages: state.alertMessages.map((item) =>
            item.caller === caller ? { ...item, message } : item
          ),
        };
      }

      return {
        alertMessages: [
          ...state.alertMessages,
          { caller, message, key: Date.now().toString() },
        ],
      };
    });
  },
  changeFaction: (factionType) => {
    const nextFaction = findFaction(factionType) ?? getInitialFaction();

    set((state) => ({
      ...state,
      ...buildDeckStateForFaction(nextFaction),
      savedDecks: state.savedDecks,
    }));
  },
  resetDeck: (factionType) => {
    const nextFaction = findFaction(factionType) ?? get().selectedFaction;

    set((state) => ({
      ...state,
      ...buildDeckStateForFaction(nextFaction),
      savedDecks: state.savedDecks,
    }));
  },
  addCard: (id) => {
    set((state) => ({
      selectedCards: applySelectionCount(state.selectedCards, id, "add"),
    }));
  },
  removeCard: (id) => {
    set((state) => ({
      selectedCards: applySelectionCount(state.selectedCards, id, "remove"),
    }));
  },
  addSquad: (id) => {
    set((state) => ({
      selectedSquads: applySelectionCount(state.selectedSquads, id, "add"),
    }));
  },
  removeSquad: (id) => {
    set((state) => ({
      selectedSquads: applySelectionCount(state.selectedSquads, id, "remove"),
    }));
  },
  loadDeck: (id) => {
    const deck = get().savedDecks.find((savedDeck) => savedDeck.id === id);
    if (!deck) {
      return false;
    }

    const hydratedDeck = hydrateSavedDeck(deck);
    if (!hydratedDeck) {
      return false;
    }

    set((state) => ({
      ...state,
      ...hydratedDeck,
      deckId: id,
    }));

    return true;
  },
  loadSharedDeck: (args) => {
    const hydratedDeck = hydrateSharedDeck(args);
    if (!hydratedDeck) {
      return false;
    }

    set((state) => ({
      ...state,
      ...hydratedDeck,
    }));

    return true;
  },
  saveDeck: (id) => {
    const state = get();
    const targetDeckId = id ?? state.deckId;

    const savedDeck = buildSavedDeck(state, targetDeckId);
    if (!savedDeck) {
      return { ok: false, reason: "missingName" };
    }

    const savedDecks = upsertSavedDeck(state.savedDecks, savedDeck);

    persistSavedDecks(savedDecks);
    set({
      savedDecks,
      deckId: targetDeckId,
    });

    return { ok: true, deckId: targetDeckId };
  },
  saveAsDeck: () => {
    const nextDeckId = Date.now().toString();
    const result = get().saveDeck(nextDeckId);

    if (!result.ok) {
      return result;
    }

    set({ deckId: nextDeckId });
    return { ok: true, deckId: nextDeckId };
  },
}));

export function useDeckViewState() {
  return {
    alertMessages: useDeckStore((state) => state.alertMessages),
    deckId: useDeckStore((state) => state.deckId),
    deckName: useDeckStore((state) => state.deckName),
    savedDecks: useDeckStore((state) => state.savedDecks),
    selectedBanner: useDeckStore((state) => state.selectedBanner),
    selectedCards: useDeckStore((state) => state.selectedCards),
    selectedFaction: useDeckStore((state) => state.selectedFaction),
    selectedShrine: useDeckStore((state) => state.selectedShrine),
    selectedSquads: useDeckStore((state) => state.selectedSquads),
  };
}

export function useDeckActions(): DeckActions &
  Pick<DeckStoreState, "initialize" | "loadSharedDeck" | "saveDeck" | "saveAsDeck"> {
  return {
    initialize: useDeckStore((state) => state.initialize),
    addCard: useDeckStore((state) => state.addCard),
    removeCard: useDeckStore((state) => state.removeCard),
    addSquad: useDeckStore((state) => state.addSquad),
    removeSquad: useDeckStore((state) => state.removeSquad),
    setDeckName: useDeckStore((state) => state.setDeckName),
    setBanner: useDeckStore((state) => state.setBanner),
    setShrine: useDeckStore((state) => state.setShrine),
    setAlertMessage: useDeckStore((state) => state.setAlertMessage),
    changeFaction: useDeckStore((state) => state.changeFaction),
    resetDeck: useDeckStore((state) => state.resetDeck),
    loadDeck: useDeckStore((state) => state.loadDeck),
    loadSharedDeck: useDeckStore((state) => state.loadSharedDeck),
    saveDeck: useDeckStore((state) => state.saveDeck),
    saveAsDeck: useDeckStore((state) => state.saveAsDeck),
  };
}
