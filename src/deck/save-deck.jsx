import React from "react";

import { SaveOutlined } from "@ant-design/icons";

import { Button, Menu, Dropdown } from "antd";
const { SubMenu } = Menu;

export default function SaveDeck({ savedDecks, loadDeck, factions }) {
  let menu = (
    <Menu>
      {factions.map((faction, index) => (
        <SubMenu key={faction.type} title={faction.name}>
          {savedDecks.filter((d) => d.faction === faction.type).length > 0 ? (
            savedDecks
              .filter((d) => d.faction === faction.type)
              .map((deck, deckIndex) => {
                return (
                  <Menu.Item key={deck.id} onClick={() => loadDeck(deck.id)}>
                    {deck.name ? deck.name : "Deck " + deck.id}
                  </Menu.Item>
                );
              })
          ) : (
            <Menu.Item>No saved decks</Menu.Item>
          )}
        </SubMenu>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <Button key="save" size="small">
        <SaveOutlined />
        Saved decks
      </Button>
    </Dropdown>
  );
}
