export default function userDeckReducer(state, action) {
  switch (action.type) {
    case "reset":
      return action.reset;
    case "addOrUpdate":
      let newDeck = {
        name: action.deckName,
        id: action.id,
        cards: action.cards,
        squads: action.squads,
        faction: action.faction,
        selectedShrine: action.selectedShrine,
        selectedBanner: action.selectedBanner,
      };

      let deckIndex = state.findIndex((d) => d.id === action.id);

      if (deckIndex > -1) {
        let updatedDecks = [
          ...state.slice(0, deckIndex),
          newDeck,
          ...state.slice(deckIndex + 1),
        ];

        return updatedDecks;
      } else {
        return [...state, newDeck];
      }

    case "remove":
      let existingItemToRemoveIndex = state.findIndex(
        (d) => d.id === action.id
      );

      if (existingItemToRemoveIndex === -1) return state;

      return [
        ...state[existingItemToRemoveIndex].decks.slice(0, deckIndex),
        ...state[existingItemToRemoveIndex].decks.slice(deckIndex + 1),
      ];
    default:
      throw new Error();
  }
}
