export type DeckId = string | number;

export interface Card {
  id: number;
  key: number;
  img: string;
  cardCount: number;
  upperAction: string;
  upperCost: string | number;
  upperActionText: string;
  lowerCost: string | number;
  costType: string;
  lowerAction: string;
  lowerActionText: string;
  squad: string;
  count: number;
  faction: string;
  ignoreLimit?: boolean;
}

export interface Squad {
  id: number;
  type: string;
  name: string;
  img?: string;
  imgBack?: string;
  imgBackEvolved?: string;
  cardCount: number;
  isElite: boolean;
  isCavalry: boolean;
  isBoss?: boolean;
  count: number;
  faction: string;
}

export interface Faction {
  id: number;
  type: string;
  name: string;
  bannerFrontImageSrc: string;
  bannerBackImageSrc?: string;
  bannerAlternativeFront: string;
  bannerAlternativeBack?: string;
  shrine: string;
  shrineAlternative: string;
}

export interface SavedDeck {
  id: DeckId;
  faction: string;
  squads: number[];
  cards: number[];
  name: string;
  selectedShrine?: string;
  selectedBanner?: string;
}

export interface AlertMessage {
  caller: string;
  message: string;
  key: string;
}

export interface DeckActions {
  addCard: (id: number) => void;
  removeCard: (id: number) => void;
  addSquad: (id: number) => void;
  removeSquad: (id: number) => void;
  setDeckName: (deckName: string) => void;
  setBanner: (banner: string) => void;
  setShrine: (shrine: string) => void;
  setAlertMessage: (caller: string, message: string) => void;
  changeFaction: (factionType: string) => void;
  resetDeck: (factionType?: string) => void;
  loadDeck: (id: DeckId) => boolean;
}
