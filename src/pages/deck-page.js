import "../deck-table/deck-table.css";
// Data
import { cards } from "../cards";
import { squadTypes } from "../squadTypes";

import { factions } from "../factions";

import React, { useState, useEffect, useReducer, useCallback } from "react";
import { Button, Col, Row, message, Space } from "antd";

import { useLocation, useHistory } from "react-router-dom";
import { LinkOutlined, PlusSquareOutlined } from "@ant-design/icons";

import copy from "copy-to-clipboard";

// Own components
import DeckTable from "../deck-table/deck-table";
import SquadSelector from "../squad-selector/squad-selector";
import Deck from "../deck/deck";
import SaveDeck from "../deck/save-deck";

import DisplayMessages from "../display-messages/display-messages";

import cardReducer from "../deck-table/cardReducer";

const getInitialSquad = (selectedFaction) => {
  var localStorageSquads = JSON.parse(window.localStorage.getItem("squads"));
  if (localStorageSquads) {
    window.localStorage.removeItem("squads");
    return localStorageSquads;
  }

  var listOfSquads = squadTypes.filter(
    (squad) =>
      squad.type !== "ANY_SQUAD" && squad.faction === selectedFaction.type
  );
  listOfSquads.forEach((element) => {
    element.count = 0;
  });

  return listOfSquads;
};

const getInitialCards = (selectedFaction) => {
  var localStorageCards = JSON.parse(window.localStorage.getItem("cards"));
  if (localStorageCards) {
    window.localStorage.removeItem("cards");
    return localStorageCards;
  }

  var listOfCards = cards.filter(
    (card) => card.faction === selectedFaction.type
  );
  console.log(listOfCards);
  return listOfCards;
};

const getInitialFaction = () => {
  var localStorageFaction = JSON.parse(window.localStorage.getItem("faction"));
  if (localStorageFaction) {
    window.localStorage.removeItem("faction");
    return localStorageFaction;
  }

  return factions[0];
};

export default function DeckPage({ readonly }) {
  const [alertMessages, setAlertMessages] = useState([]);
  const [deckName, setDeckName] = useState("");
  const location = useLocation();
  const history = useHistory();

  const [selectedSquads, dispatchSquads] = useReducer(cardReducer, []);
  const [selectedCards, dispatchCards] = useReducer(cardReducer, []);
  const [selectedFaction, setFaction] = useState(getInitialFaction());
  const [savedDecks, setSavedDecks] = useState([
    {
      faction: "Chapter",
      decks: [{ name: "My cool deck", id: 1 }, { id: 2 }, { id: 3 }],
    },
    {
      faction: "Demon",
      decks: [{ name: "My cool deck", id: 1 }, { id: 2 }, { id: 3 }],
    },
    {
      faction: "Darkness",
      decks: [],
    },
  ]);

  const changeFaction = useCallback((faction) => {
    var newFaction = factions.find((f) => f.type === faction);
    setFaction(newFaction);
    return newFaction;
  }, []);

  // This needs to fire before the query fetching
  useEffect(() => {
    debugger;
    if (location.pathname !== "/") return;
    dispatchSquads({
      type: "reset",
      reset: getInitialSquad(selectedFaction),
    });
    console.log(selectedFaction);
    dispatchCards({ type: "reset", reset: getInitialCards(selectedFaction) });
    // clear cards
  }, [selectedFaction]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    var queryCardIds = searchParams.get("cards")?.split(",");

    var querySquadIds = searchParams.get("squads")?.split(",");
    var queryFaction = searchParams.get("faction");

    if (!queryCardIds || !querySquadIds || !queryFaction) return;

    var faction = changeFaction(queryFaction);
    dispatchSquads({
      type: "reset",
      reset: getInitialSquad(faction),
    });

    dispatchCards({ type: "reset", reset: getInitialCards(faction) });

    queryCardIds.forEach((id) => {
      dispatchCards({ type: "add", id: parseInt(id) });
    });
    querySquadIds.forEach((id) => {
      dispatchSquads({ type: "add", id: parseInt(id) });
    });
  }, [location]);

  const setAlertMessage = useCallback(
    (caller, message) => {
      var messages = [...alertMessages];
      var exist = messages.find((item) => item.caller === caller);

      if (exist) {
        if (exist.message === message) return;

        if (message === "")
          setAlertMessages(messages.filter((msg) => msg.caller !== caller));
        else {
          setAlertMessages((prevItems) =>
            prevItems.map((item) =>
              item === exist
                ? {
                    caller,
                    message,
                  }
                : item
            )
          );
        }
      } else if (message !== "") {
        setAlertMessages([...alertMessages, { caller, message }]);
      }
    },
    [alertMessages]
  );

  const getIdsFromList = (list) => {
    let items = list.reduce((total, item) => {
      if (item.count > 0) {
        [...Array(item.count)].forEach(() => {
          total.push(item.id);
        });
      }
      return total;
    }, []);
    return items;
  };
  const copyDeckUrlToClipboard = () => {
    var squads = getIdsFromList(selectedSquads);
    var cards = getIdsFromList(selectedCards);
    var url =
      window.location.origin +
      "/deck?cards=" +
      cards.toString() +
      "&squads=" +
      squads.toString() +
      "&faction=" +
      selectedFaction.type;

    copy(url, {
      debug: true,
      message: "Press #{key} to copy",
    });

    message.success(url + " was copied to your clipboard");
  };

  const saveDeck = () => {
    console.log("save deck");
  };

  return (
    <div>
      <div className="site-card-wrapper">
        <Space>
          <Button
            key="new"
            size="small"
            onClick={() => {
              window.localStorage.setItem(
                "squads",
                JSON.stringify(selectedSquads)
              );
              window.localStorage.setItem(
                "cards",
                JSON.stringify(selectedCards)
              );
              window.localStorage.setItem(
                "faction",
                JSON.stringify(selectedFaction)
              );
              history.push("");
            }}
          >
            <PlusSquareOutlined /> New deck
          </Button>
          <Button
            key="share"
            size="small"
            onClick={() => copyDeckUrlToClipboard()}
          >
            <LinkOutlined /> Share deck url
          </Button>
          <SaveDeck savedDecks={savedDecks}></SaveDeck>
        </Space>
      </div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <SquadSelector
              readonly={readonly}
              selectedSquads={selectedSquads}
              selectedCards={selectedCards}
              setAlertMessage={setAlertMessage}
              dispatchSquads={dispatchSquads}
              changeFaction={changeFaction}
              factions={factions}
              selectedFaction={selectedFaction}
            ></SquadSelector>
          </Col>
          <Col span={8}>
            <Deck
              setDeckName={setDeckName}
              deckName={deckName}
              selectedCards={selectedCards}
              saveDeck={saveDeck}
            ></Deck>
          </Col>
          <Col span={8}>
            <DisplayMessages alertMessages={alertMessages} />
          </Col>
        </Row>
      </div>

      <div className="site-card-wrapper">
        <DeckTable
          readonly={readonly}
          squadTypes={squadTypes}
          selectedCards={selectedCards}
          dispatchCards={dispatchCards}
          availableCards={cards}
        ></DeckTable>
      </div>
    </div>
  );
}
