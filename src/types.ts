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
  readonly?: boolean;
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

export type CardReducerAction =
  | { type: "reset"; reset: Card[] | Squad[] }
  | { type: "add"; id: number }
  | { type: "remove"; id: number };
