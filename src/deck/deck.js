import React from "react";
import { Card, Popover, Button, Input } from "antd";
import "./deck.css";

export default function Deck({
  selectedCards,
  deckName,
  setDeckName,
  saveDeck,
  deckId,
  dispatchCards,
  readonly,
}) {
  const numerOfSelectedCards = () => {
    if (!selectedCards) return 0;
    return selectedCards.length > 0
      ? selectedCards.reduce((previous, current) => {
          if (current.ignoreLimit) return previous;
          else return previous + current.count;
        }, 0)
      : 0;
  };

  var content = (cardSource) => (
    <div>
      <img className="deck-table__card-image" src={cardSource} alt="" />
    </div>
  );

  const deckTitle = () => {
    return "Deck - " + numerOfSelectedCards().toString() + " / 25";
  };
  return (
    <Card type="inner" title={deckTitle()} bordered={true}>
      {numerOfSelectedCards() > 0 ? (
        <div>
          {selectedCards
            .filter((card) => card.count > 0)
            .map((item) => (
              <div key={item.id}>
                <Popover
                  content={content(item.img)}
                  trigger="hover"
                  placement="right"
                >
                  <Button type="link">{item.lowerAction}</Button>
                </Popover>
                <span
                  style={{
                    float: "right",
                    flexGrow: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {!readonly && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        dispatchCards({ type: "remove", id: item.id })
                      }
                    >
                      -
                    </Button>
                  )}
                  {item.count} / {item.cardCount}
                  {!readonly && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        dispatchCards({ type: "add", id: item.id })
                      }
                      disabled={item.cardCount === item.count || readonly}
                    >
                      +
                    </Button>
                  )}
                </span>
              </div>
            ))}
          <span className="deck-name-edit">
            <Input
              placeholder="Deck name"
              className="deck-name-edit__edit"
              value={deckName}
              onChange={(event) => setDeckName(event.target.value)}
            />

            <Button
              type="primary"
              htmlType="submit"
              className="deck-name-edit__save"
              disabled={deckId < 50}
              onClick={saveDeck}
            >
              Save
            </Button>
          </span>
        </div>
      ) : (
        <div>Start constructing your deck by adding cards from below.</div>
      )}
    </Card>
  );
}
