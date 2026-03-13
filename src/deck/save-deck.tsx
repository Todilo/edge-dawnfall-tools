import { Button, Dropdown, Menu } from "antd";

import type { DeckId, Faction, SavedDeck } from "../types";

const { SubMenu } = Menu;

interface SaveDeckProps {
  savedDecks: SavedDeck[];
  loadDeck: (id: DeckId) => void;
  factions: Faction[];
}

export default function SaveDeck({
  savedDecks,
  loadDeck,
  factions,
}: SaveDeckProps) {
  const menu = (
    <Menu>
      {factions.map((faction) => {
        const factionDecks = savedDecks.filter(
          (deck) => deck.faction === faction.type
        );

        return (
          <SubMenu key={faction.type} title={faction.name}>
            {factionDecks.length > 0 ? (
              factionDecks.map((deck) => (
                <Menu.Item key={deck.id} onClick={() => loadDeck(deck.id)}>
                  {deck.name ? deck.name : `Deck ${deck.id}`}
                </Menu.Item>
              ))
            ) : (
              <Menu.Item disabled>No saved decks</Menu.Item>
            )}
          </SubMenu>
        );
      })}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <Button key="save" size="small">
        Saved decks
      </Button>
    </Dropdown>
  );
}
