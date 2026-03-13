import { Button, Card, Input, Popover } from "antd";

import type { Card as DeckCard, DeckId } from "../types";
import "./deck.css";

interface DeckProps {
  selectedCards: DeckCard[];
  deckName: string;
  setDeckName: (deckName: string) => void;
  saveDeck: () => void;
  saveAsDeck: () => void;
  deckId: DeckId;
  addCard: (id: number) => void;
  removeCard: (id: number) => void;
  readonly: boolean;
}

function getNumberOfSelectedCards(selectedCards: DeckCard[]) {
  return selectedCards.reduce((previous, current) => {
    if (current.ignoreLimit) {
      return previous;
    }

    return previous + current.count;
  }, 0);
}

function renderCardPreview(cardSource: string) {
  return (
    <div>
      <img className="deck-table__card-image" src={cardSource} alt="" />
    </div>
  );
}

export default function Deck({
  selectedCards,
  deckName,
  setDeckName,
  saveDeck,
  saveAsDeck,
  deckId,
  addCard,
  removeCard,
  readonly,
}: DeckProps) {
  const numberOfSelectedCards = getNumberOfSelectedCards(selectedCards);

  return (
    <Card
      type="inner"
      title={`Deck - ${numberOfSelectedCards.toString()} / 25`}
      bordered
    >
      {numberOfSelectedCards > 0 ? (
        <div>
          {selectedCards
            .filter((card) => card.count > 0)
            .map((item) => (
              <div key={item.id}>
                <Popover
                  content={renderCardPreview(item.img)}
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
                      onClick={() => removeCard(item.id)}
                    >
                      -
                    </Button>
                  )}
                  {item.count} / {item.cardCount}
                  {!readonly && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => addCard(item.id)}
                      disabled={item.cardCount === item.count}
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
              disabled={Number(deckId) < 50}
              onClick={saveDeck}
            >
              Save
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="deck-name-edit__save"
              onClick={saveAsDeck}
            >
              Save As
            </Button>
          </span>
        </div>
      ) : (
        <div>Start constructing your deck by adding cards from below.</div>
      )}
    </Card>
  );
}
