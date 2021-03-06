export default function cardReducer(state, action) {
  switch (action.type) {
    case "reset":
      return action.reset;
    case "add":
      const existingItemToAdd = state.find(
        (item) => item.id === action.id && item.count < item.cardCount
      );
      if (
        !existingItemToAdd ||
        existingItemToAdd.count + 1 > existingItemToAdd.cardCount
      )
        return state;

      return state.map((item) =>
        item.id === existingItemToAdd.id
          ? {
              ...item,
              count: item.count + 1,
            }
          : item
      );
    case "remove":
      const existingItemToRemove = state.find(
        (item) => item.id === action.id && item.count > 0
      );
      if (!existingItemToRemove) return;

      return state.map((item) =>
        item.id === existingItemToRemove.id
          ? {
              ...item,
              count: item.count - 1,
            }
          : item
      );
    default:
      debugger;
      throw new Error();
  }
}
