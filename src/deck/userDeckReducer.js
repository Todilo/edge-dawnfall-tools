export default function userDeckReducer(state, action) {
  switch (action.type) {
    case "reset":
      return action.reset;
    case "addOrUpdate":
      var newDeck = {
        name: action.deckName,
        id: action.id,
        cards: action.cards,
        squads: action.squads,
        faction: action.faction,
      };

      var deckIndex = state.findIndex((d) => d.id === action.id);

      if (deckIndex > -1) {
        var updatedDecks = [
          ...state.slice(0, deckIndex),
          newDeck,
          ...state.slice(deckIndex + 1),
        ];

        return updatedDecks;
      } else {
        return [...state, newDeck];
      }

    case "remove":
      var existingItemToRemoveIndex = state.findIndex(
        (d) => d.id === action.id
      );

      if (existingItemToRemoveIndex === -1) return;

      return [
        ...state[existingItemToRemoveIndex].decks.slice(0, deckIndex),
        ...state[existingItemToRemoveIndex].decks.slice(deckIndex + 1),
      ];
    default:
      throw new Error();
  }
}
