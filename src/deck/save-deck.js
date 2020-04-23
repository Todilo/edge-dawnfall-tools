import React from "react";

import { SaveOutlined } from "@ant-design/icons";

import { Button, Menu, Dropdown } from "antd";
const { SubMenu } = Menu;

export default function SaveDeck({ savedDecks }) {
  let menu = (
    <Menu>
      {savedDecks.map((faction, index) => (
        <SubMenu key={faction.faction} title={faction.faction}>
          {faction.decks.length > 0 ? (
            faction.decks.map((deck, deckIndex) => {
              return (
                <Menu.Item key={deck.id}>
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
        Save deck
      </Button>
    </Dropdown>
  );
}
