import "deck-table/deck-table.css";
// Data
import { cards } from "cards";
import { squadTypes } from "squadTypes";
import { defaultDecks } from "default_decks";

import { factions } from "factions";

import React, { useState, useEffect, useReducer, useCallback } from "react";
import { Button, Col, Row, message, Space, Menu, Dropdown } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { useLocation, useHistory } from "react-router-dom";
import { LinkOutlined, PlusSquareOutlined } from "@ant-design/icons";

import copy from "copy-to-clipboard";

import deckExporter from "deckExporter";
import { saveAs } from "file-saver";

// Own components
import DeckTable from "deck-table/deck-table";
import SquadSelector from "squad-selector/squad-selector";
import Deck from "deck/deck";
import SaveDeck from "deck/save-deck";

import DisplayMessages from "display-messages/display-messages";

import cardReducer from "deck-table/cardReducer";
import userDeckReducer from "deck/userDeckReducer";

const getInitialSquad = (selectedFaction) => {
  let listOfSquads = squadTypes.filter(
    (squad) =>
      squad.type !== "ANY_SQUAD" && squad.faction === selectedFaction.type
  );
  listOfSquads.forEach((element) => {
    element.count = 0;
  });

  return listOfSquads;
};
const getInitialUserDecks = () => {
  let decks = JSON.parse(localStorage.getItem("savedDecks")) || [];
  defaultDecks.forEach((deck) => {
    if (decks.some((d) => d.id === deck.id)) return;
    decks.push(deck);
  });
  return decks;
};

const getInitialCards = (selectedFaction) => {
  let listOfCards = cards.filter(
    (card) => card.faction === selectedFaction.type
  );
  return listOfCards;
};

const getInitialFaction = () => {
  return factions[0];
};

export default function DeckPage({ readonly = false }) {
  const [isDeckLocked, setIsDeckLocked] = useState(readonly);
  const [alertMessages, setAlertMessages] = useState([]);
  const [deckName, setDeckName] = useState("New deck");
  const [selectedBanner, setBanner] = useState("regular");
  const [selectedShrine, setShrine] = useState("regular");
  const [deckId, setDeckId] = useState(Date.now().toString());
  const location = useLocation();
  const history = useHistory();

  const [selectedSquads, dispatchSquads] = useReducer(cardReducer, []);
  const [selectedCards, dispatchCards] = useReducer(cardReducer, []);
  const [selectedFaction, setFaction] = useState(getInitialFaction());
  const [savedDecks, dispatchDecks] = useReducer(userDeckReducer, []);
  const loadDeck = (id) => {
    let deck = savedDecks.find((deck) => deck.id === id);

    let faction = changeFaction(deck.faction);
    dispatchSquads({
      type: "reset",
      reset: getInitialSquad(faction),
    });

    dispatchCards({ type: "reset", reset: getInitialCards(faction) });

    deck.cards.forEach((id) => {
      dispatchCards({ type: "add", id });
    });
    deck.squads.forEach((id) => {
      dispatchSquads({ type: "add", id });
    });
    setDeckName(deck.name);
    setBanner(deck.selectedBanner);
    setShrine(deck.selectedShrine);
    setDeckId(id);
  };

  const newDeck = () => {
    history.push("");
    reset();
  };

  useEffect(() => {
    setIsDeckLocked(readonly || deckId < 50);
  }, [deckId, readonly]);

  const saveDeck = () => {
    let faction = selectedFaction.type;
    let squads = getIdsFromList(selectedSquads);
    let cards = getIdsFromList(selectedCards);

    if (deckName.length === 0) {
      message.error("Can not save deck, please set a name.");
      return;
    }

    dispatchDecks({
      type: "addOrUpdate",
      faction: faction,
      squads: squads,
      cards: cards,
      deckName: deckName,
      selectedBanner: selectedBanner,
      selectedShrine: selectedShrine,
      id: deckId,
    });
    history.push("");
  };

  const saveAsDeck = () => {
    let faction = selectedFaction.type;
    let squads = getIdsFromList(selectedSquads);
    let cards = getIdsFromList(selectedCards);

    if (deckName.length === 0) {
      message.error("Can not save deck, please set a name.");
      return;
    }
    var newDeckId = Date.now().toString();
    setDeckId(newDeckId);
    dispatchDecks({
      type: "addOrUpdate",
      faction: faction,
      squads: squads,
      cards: cards,
      deckName: deckName,
      selectedBanner: selectedBanner,
      selectedShrine: selectedShrine,
      id: newDeckId,
    });
    history.push("");
  };

  useEffect(() => {
    // Intentionally not possible to clear save-decks because that was too tricky.
    if (savedDecks.length > 0) {
      localStorage.setItem("savedDecks", JSON.stringify(savedDecks));
    }
  }, [savedDecks]);

  const changeFaction = useCallback((faction) => {
    let newFaction = factions.find((f) => f.type === faction);
    setFaction(newFaction);
    return newFaction;
  }, []);

  const reset = () => {
    dispatchSquads({
      type: "reset",
      reset: getInitialSquad(selectedFaction),
    });
    dispatchCards({ type: "reset", reset: getInitialCards(selectedFaction) });
    dispatchDecks({ type: "reset", reset: getInitialUserDecks() });
    setDeckId(Date.now().toString());
  };

  // This needs to fire before the query fetching
  useEffect(() => {
    if (location.pathname !== "/") return;
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFaction]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let queryCardIds = searchParams.get("cards");
    if (!queryCardIds) return;
    queryCardIds = queryCardIds.split(",").filter((s) => s !== "");

    let querySquadIds = searchParams.get("squads");

    if (!querySquadIds) return;
    querySquadIds = searchParams
      .get("squads")
      .split("")
      .filter((s) => s !== "");
    let queryFaction = searchParams.get("faction");
    let deckName = searchParams.get("deckname");

    if (
      queryCardIds.length === 0 ||
      querySquadIds.length === 0 ||
      !queryFaction
    )
      return;

    let faction = changeFaction(queryFaction);
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
    setDeckName(deckName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const setAlertMessage = useCallback(
    (caller, message) => {
      let messages = [...alertMessages];
      let exist = messages.find((item) => item.caller === caller);

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
        setAlertMessages([
          ...alertMessages,
          { caller, message, key: Date.now().toString() },
        ]);
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

  const exportDeckToODS = () => {
    let fileWithInfo = deckExporter(
      selectedCards,
      selectedSquads,
      deckName,
      selectedBanner,
      selectedShrine,
      "ods"
    );
    saveAs(fileWithInfo.blob, fileWithInfo.fileName);
  };

  const exportDeckToXLSX = () => {
    let fileWithInfo = deckExporter(
      selectedCards,
      selectedSquads,
      deckName,
      selectedBanner,
      selectedShrine,
      "xlsx"
    );
    saveAs(fileWithInfo.blob, fileWithInfo.fileName);
  };

  let exportMenu = (
    <Menu>
      <Menu.Item key="shareods" onClick={() => exportDeckToODS()}>
        ODS
      </Menu.Item>
      <Menu.Item key="sharexlxs" onClick={() => exportDeckToXLSX()}>
        Excel
      </Menu.Item>
    </Menu>
  );

  const copyDeckUrlToClipboard = () => {
    let squads = getIdsFromList(selectedSquads);
    let cards = getIdsFromList(selectedCards);
    if (cards.length === 0) {
      message.error("Unable to share deck. You have not selected any cards");
      return;
    }
    if (squads.length === 0) {
      message.error("Unable to share deck. You have not selected any squads");
      return;
    }
    let url =
      window.location.origin +
      "/deck?cards=" +
      cards.toString() +
      "&squads=" +
      squads.toString() +
      "&faction=" +
      selectedFaction.type +
      "&deckname=" +
      encodeURIComponent(deckName);

    copy(url, {
      debug: true,
      message: "Press #{key} to copy",
    });

    message.success(url + " was copied to your clipboard");
  };

  return (
    <React.Fragment>
      <div className="site-card-wrapper">
        <Space>
          <Button
            key="new"
            size="small"
            onClick={() => {
              newDeck();
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

          <Dropdown overlay={exportMenu} placement="bottomLeft">
            <Button key="save" size="small">
              <FileExcelOutlined />
              Export to file
            </Button>
          </Dropdown>

          <SaveDeck
            savedDecks={savedDecks}
            loadDeck={loadDeck}
            factions={factions}
          ></SaveDeck>
        </Space>
      </div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col sm={24} xs={24} md={24} lg={8}>
            <SquadSelector
              readonly={isDeckLocked}
              selectedSquads={selectedSquads}
              selectedCards={selectedCards}
              setAlertMessage={setAlertMessage}
              dispatchSquads={dispatchSquads}
              changeFaction={changeFaction}
              factions={factions}
              selectedFaction={selectedFaction}
              setBanner={setBanner}
              setShrine={setShrine}
              selectedBanner={selectedBanner}
              selectedShrine={selectedShrine}
            ></SquadSelector>
          </Col>
          <Col md={24} sm={24} xs={24} lg={8}>
            <Deck
              readonly={isDeckLocked}
              deckId={deckId}
              setDeckName={setDeckName}
              deckName={deckName}
              selectedCards={selectedCards}
              saveDeck={saveDeck}
              saveAsDeck={saveAsDeck}
              dispatchCards={dispatchCards}
            ></Deck>
          </Col>
          <Col md={24} sm={24} xs={24} lg={8}>
            <DisplayMessages alertMessages={alertMessages} />
          </Col>
        </Row>
      </div>

      <div className="site-card-wrapper">
        <DeckTable
          readonly={isDeckLocked}
          squadTypes={squadTypes}
          selectedCards={selectedCards}
          dispatchCards={dispatchCards}
          availableCards={cards}
        ></DeckTable>
      </div>
    </React.Fragment>
  );
}
