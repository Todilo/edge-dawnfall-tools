import { cards as allCards } from "../cards";
import { defaultDecks } from "../default_decks";
import { factions } from "../factions";
import { squadTypes } from "../squadTypes";
import type {
  AlertMessage,
  Card,
  DeckId,
  Faction,
  SavedDeck,
  Squad,
} from "../types";
import {
  DEFAULT_BANNER,
  DEFAULT_DECK_NAME,
  DEFAULT_SHARED_DECK_NAME,
  DEFAULT_SHRINE,
} from "./constants";

export interface DeckStateSlice {
  selectedFaction: Faction;
  selectedSquads: Squad[];
  selectedCards: Card[];
  deckId: DeckId;
  deckName: string;
  selectedBanner: string;
  selectedShrine: string;
  alertMessages: AlertMessage[];
}

export interface LoadSharedDeckArgs {
  cardIds: number[];
  squadIds: number[];
  factionType: string;
  deckName?: string | null;
}

export interface SaveDeckResult {
  ok: boolean;
  reason?: "missingName";
  deckId?: DeckId;
}

export function getInitialFaction(): Faction {
  return factions[0] as Faction;
}

export function findFaction(factionType?: string | null): Faction | null {
  return (
    ((factions as Faction[]).find((faction) => faction.type === factionType) ??
      null)
  );
}

export function cloneSquadsForFaction(selectedFaction: Faction): Squad[] {
  return squadTypes
    .filter(
      (squad) =>
        squad.type !== "ANY_SQUAD" && squad.faction === selectedFaction.type
    )
    .map((squad) => ({
      ...squad,
      count: 0,
    })) as Squad[];
}

export function cloneCardsForFaction(selectedFaction: Faction): Card[] {
  return allCards
    .filter((card) => card.faction === selectedFaction.type)
    .map((card) => ({
      ...card,
      count: 0,
    })) as Card[];
}

export function mergeSavedDecks(parsedDecks: SavedDeck[]): SavedDeck[] {
  const decks = [...parsedDecks];

  defaultDecks.forEach((deck) => {
    if (!decks.some((storedDeck) => storedDeck.id === deck.id)) {
      decks.push(deck as SavedDeck);
    }
  });

  return decks;
}

export function getIdsFromList<T extends Card | Squad>(list: T[]): number[] {
  return list.reduce<number[]>((total, item) => {
    if (item.count > 0) {
      Array.from({ length: item.count }).forEach(() => {
        total.push(item.id);
      });
    }

    return total;
  }, []);
}

export function applySelectionCount<T extends Card | Squad>(
  state: T[],
  id: number,
  direction: "add" | "remove"
): T[] {
  if (direction === "add") {
    const existingItem = state.find(
      (item) => item.id === id && item.count < item.cardCount
    );

    if (!existingItem || existingItem.count + 1 > existingItem.cardCount) {
      return state;
    }

    return state.map((item) =>
      item.id === id
        ? {
            ...item,
            count: item.count + 1,
          }
        : item
    );
  }

  const existingItem = state.find((item) => item.id === id && item.count > 0);
  if (!existingItem) {
    return state;
  }

  return state.map((item) =>
    item.id === id
      ? {
          ...item,
          count: item.count - 1,
        }
      : item
  );
}

export function buildDeckStateForFaction(
  selectedFaction: Faction,
  deckId: DeckId = Date.now().toString()
): DeckStateSlice {
  return {
    selectedFaction,
    selectedSquads: cloneSquadsForFaction(selectedFaction),
    selectedCards: cloneCardsForFaction(selectedFaction),
    deckId,
    deckName: DEFAULT_DECK_NAME,
    selectedBanner: DEFAULT_BANNER,
    selectedShrine: DEFAULT_SHRINE,
    alertMessages: [],
  };
}

export function hydrateSavedDeck(deck: SavedDeck): DeckStateSlice | null {
  const nextFaction = findFaction(deck.faction) ?? getInitialFaction();

  let selectedCards = cloneCardsForFaction(nextFaction);
  let selectedSquads = cloneSquadsForFaction(nextFaction);

  deck.cards.forEach((cardId) => {
    selectedCards = applySelectionCount(selectedCards, Number(cardId), "add");
  });
  deck.squads.forEach((squadId) => {
    selectedSquads = applySelectionCount(selectedSquads, Number(squadId), "add");
  });

  return {
    selectedFaction: nextFaction,
    selectedCards,
    selectedSquads,
    deckName: deck.name,
    selectedBanner: deck.selectedBanner ?? DEFAULT_BANNER,
    selectedShrine: deck.selectedShrine ?? DEFAULT_SHRINE,
    deckId: deck.id,
    alertMessages: [],
  };
}

export function hydrateSharedDeck({
  cardIds,
  squadIds,
  factionType,
  deckName,
}: LoadSharedDeckArgs): DeckStateSlice | null {
  const nextFaction = findFaction(factionType);

  if (!nextFaction || cardIds.length === 0 || squadIds.length === 0) {
    return null;
  }

  let selectedCards = cloneCardsForFaction(nextFaction);
  let selectedSquads = cloneSquadsForFaction(nextFaction);

  cardIds.forEach((cardId) => {
    selectedCards = applySelectionCount(selectedCards, cardId, "add");
  });
  squadIds.forEach((squadId) => {
    selectedSquads = applySelectionCount(selectedSquads, squadId, "add");
  });

  return {
    selectedFaction: nextFaction,
    selectedCards,
    selectedSquads,
    deckName: deckName ?? DEFAULT_SHARED_DECK_NAME,
    selectedBanner: DEFAULT_BANNER,
    selectedShrine: DEFAULT_SHRINE,
    deckId: Date.now().toString(),
    alertMessages: [],
  };
}

export function buildSavedDeck(
  state: Pick<
    DeckStateSlice,
    | "deckId"
    | "deckName"
    | "selectedCards"
    | "selectedSquads"
    | "selectedFaction"
    | "selectedShrine"
    | "selectedBanner"
  >,
  deckId: DeckId = state.deckId
): SavedDeck | null {
  if (state.deckName.length === 0) {
    return null;
  }

  return {
    name: state.deckName,
    id: deckId,
    cards: getIdsFromList(state.selectedCards),
    squads: getIdsFromList(state.selectedSquads),
    faction: state.selectedFaction.type,
    selectedShrine: state.selectedShrine,
    selectedBanner: state.selectedBanner,
  };
}

export function upsertSavedDeck(
  savedDecks: SavedDeck[],
  savedDeck: SavedDeck
): SavedDeck[] {
  const deckIndex = savedDecks.findIndex((deck) => deck.id === savedDeck.id);

  if (deckIndex === -1) {
    return [...savedDecks, savedDeck];
  }

  return [
    ...savedDecks.slice(0, deckIndex),
    savedDeck,
    ...savedDecks.slice(deckIndex + 1),
  ];
}
