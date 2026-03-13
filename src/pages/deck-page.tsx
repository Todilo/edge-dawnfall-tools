import "../deck-table/deck-table.css";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Reducer,
} from "react";
import { Button, Col, Dropdown, Menu, message, Row, Space } from "antd";
import copy from "copy-to-clipboard";
import { saveAs } from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";

import { cards as allCards } from "../cards.js";
import Deck from "../deck/deck.jsx";
import SaveDeck from "../deck/save-deck.jsx";
import cardReducer from "../deck-table/cardReducer.js";
import DeckTable from "../deck-table/deck-table.jsx";
import deckExporter from "../deckExporter";
import DisplayMessages from "../display-messages/display-messages.jsx";
import { defaultDecks } from "../default_decks.js";
import userDeckReducer from "../deck/userDeckReducer.js";
import { factions } from "../factions.js";
import SquadSelector from "../squad-selector/squad-selector.jsx";
import { squadTypes } from "../squadTypes.js";
import type {
  AlertMessage,
  Card,
  CardReducerAction,
  DeckId,
  Faction,
  SavedDeck,
  Squad,
} from "../types";

const STORAGE_KEY = "savedDecks";

interface DeckPageProps {
  readonly?: boolean;
}

function cloneSquadsForFaction(selectedFaction: Faction): Squad[] {
  return squadTypes
    .filter(
      (squad) =>
        squad.type !== "ANY_SQUAD" && squad.faction === selectedFaction.type
    )
    .map((squad) => ({
      ...squad,
      count: 0,
    })) as Squad[];
}

function cloneCardsForFaction(selectedFaction: Faction): Card[] {
  return allCards
    .filter((card) => card.faction === selectedFaction.type)
    .map((card) => ({
      ...card,
      count: 0,
    })) as Card[];
}

function getInitialFaction(): Faction {
  return factions[0] as Faction;
}

function getMergedSavedDecks(): SavedDeck[] {
  let parsedDecks: SavedDeck[] = [];

  try {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    parsedDecks = fromStorage ? (JSON.parse(fromStorage) as SavedDeck[]) : [];
  } catch {
    parsedDecks = [];
  }

  const decks = [...parsedDecks];
  defaultDecks.forEach((deck) => {
    if (!decks.some((storedDeck) => storedDeck.id === deck.id)) {
      decks.push(deck as SavedDeck);
    }
  });

  return decks;
}

function getIdsFromList<T extends Card | Squad>(list: T[]): number[] {
  return list.reduce<number[]>((total, item) => {
    if (item.count > 0) {
      Array.from({ length: item.count }).forEach(() => {
        total.push(item.id);
      });
    }

    return total;
  }, []);
}

export default function DeckPage({ readonly = false }: DeckPageProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isDeckLocked, setIsDeckLocked] = useState(readonly);
  const [alertMessages, setAlertMessages] = useState<AlertMessage[]>([]);
  const [deckName, setDeckName] = useState("New deck");
  const [selectedBanner, setBanner] = useState("regular");
  const [selectedShrine, setShrine] = useState("regular");
  const [deckId, setDeckId] = useState<DeckId>(Date.now().toString());
  const [selectedFaction, setFaction] = useState<Faction>(getInitialFaction());
  const [selectedSquads, dispatchSquads] = useReducer(
    cardReducer as Reducer<Squad[], CardReducerAction>,
    []
  );
  const [selectedCards, dispatchCards] = useReducer(
    cardReducer as Reducer<Card[], CardReducerAction>,
    []
  );
  const [savedDecks, dispatchDecks] = useReducer(
    userDeckReducer as React.Reducer<SavedDeck[], unknown>,
    []
  );

  const selectedFactionType = selectedFaction.type;

  const changeFaction = useCallback((factionType: string): Faction => {
    const nextFaction = (factions as Faction[]).find(
      (faction) => faction.type === factionType
    );

    if (!nextFaction) {
      return getInitialFaction();
    }

    setFaction(nextFaction);
    return nextFaction;
  }, []);

  const reset = useCallback(
    (faction: Faction = selectedFaction) => {
      dispatchSquads({
        type: "reset",
        reset: cloneSquadsForFaction(faction),
      });
      dispatchCards({
        type: "reset",
        reset: cloneCardsForFaction(faction),
      });
      dispatchDecks({
        type: "reset",
        reset: getMergedSavedDecks(),
      });
      setDeckId(Date.now().toString());
      setDeckName("New deck");
      setBanner("regular");
      setShrine("regular");
    },
    [selectedFaction]
  );

  const loadDeck = useCallback(
    (id: DeckId) => {
      const deck = savedDecks.find((savedDeck) => savedDeck.id === id);
      if (!deck) {
        return;
      }

      const faction = changeFaction(deck.faction);

      dispatchSquads({
        type: "reset",
        reset: cloneSquadsForFaction(faction),
      });
      dispatchCards({
        type: "reset",
        reset: cloneCardsForFaction(faction),
      });

      deck.cards.forEach((cardId) => {
        dispatchCards({ type: "add", id: Number(cardId) });
      });
      deck.squads.forEach((squadId) => {
        dispatchSquads({ type: "add", id: Number(squadId) });
      });

      setDeckName(deck.name);
      setBanner(deck.selectedBanner ?? "regular");
      setShrine(deck.selectedShrine ?? "regular");
      setDeckId(id);
      navigate("/", { replace: true });
    },
    [changeFaction, navigate, savedDecks]
  );

  const newDeck = useCallback(() => {
    navigate("/", { replace: true });
    reset(selectedFaction);
  }, [navigate, reset, selectedFaction]);

  useEffect(() => {
    setIsDeckLocked(readonly || Number(deckId) < 50);
  }, [deckId, readonly]);

  useEffect(() => {
    reset(getInitialFaction());
  }, [reset]);

  useEffect(() => {
    if (savedDecks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecks));
    }
  }, [savedDecks]);

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    dispatchSquads({
      type: "reset",
      reset: cloneSquadsForFaction(selectedFaction),
    });
    dispatchCards({
      type: "reset",
      reset: cloneCardsForFaction(selectedFaction),
    });
    setDeckId(Date.now().toString());
    setDeckName("New deck");
    setBanner("regular");
    setShrine("regular");
  }, [location.pathname, selectedFaction]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryCardIds = searchParams
      .get("cards")
      ?.split(",")
      .filter(Boolean)
      .map(Number);
    const querySquadIds = searchParams
      .get("squads")
      ?.split(",")
      .filter(Boolean)
      .map(Number);
    const queryFaction = searchParams.get("faction");
    const sharedDeckName = searchParams.get("deckname");

    if (
      location.pathname !== "/deck" ||
      !queryCardIds?.length ||
      !querySquadIds?.length ||
      !queryFaction
    ) {
      return;
    }

    const faction = changeFaction(queryFaction);

    dispatchSquads({
      type: "reset",
      reset: cloneSquadsForFaction(faction),
    });
    dispatchCards({
      type: "reset",
      reset: cloneCardsForFaction(faction),
    });

    queryCardIds.forEach((cardId) => {
      dispatchCards({ type: "add", id: cardId });
    });
    querySquadIds.forEach((squadId) => {
      dispatchSquads({ type: "add", id: squadId });
    });

    setDeckName(sharedDeckName ?? "Shared deck");
    setBanner("regular");
    setShrine("regular");
  }, [changeFaction, location.pathname, location.search]);

  const saveCurrentDeck = useCallback(
    (id: DeckId) => {
      const squads = getIdsFromList(selectedSquads);
      const cards = getIdsFromList(selectedCards);

      if (deckName.length === 0) {
        message.error("Can not save deck, please set a name.");
        return;
      }

      dispatchDecks({
        type: "addOrUpdate",
        faction: selectedFactionType,
        squads,
        cards,
        deckName,
        selectedBanner,
        selectedShrine,
        id,
      });
      navigate("/", { replace: true });
    },
    [
      deckName,
      navigate,
      selectedBanner,
      selectedCards,
      selectedFactionType,
      selectedShrine,
      selectedSquads,
    ]
  );

  const saveDeck = useCallback(() => {
    saveCurrentDeck(deckId);
  }, [deckId, saveCurrentDeck]);

  const saveAsDeck = useCallback(() => {
    const nextDeckId = Date.now().toString();
    setDeckId(nextDeckId);
    saveCurrentDeck(nextDeckId);
  }, [saveCurrentDeck]);

  const setAlertMessage = useCallback((caller: string, text: string) => {
    setAlertMessages((previousMessages) => {
      const existingMessage = previousMessages.find(
        (item) => item.caller === caller
      );

      if (!text) {
        return previousMessages.filter((item) => item.caller !== caller);
      }

      if (existingMessage?.message === text) {
        return previousMessages;
      }

      if (existingMessage) {
        return previousMessages.map((item) =>
          item.caller === caller ? { ...item, message: text } : item
        );
      }

      return [
        ...previousMessages,
        { caller, message: text, key: Date.now().toString() },
      ];
    });
  }, []);

  const exportMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item key="shareods" onClick={() => exportDeckToODS()}>
          ODS
        </Menu.Item>
        <Menu.Item key="sharexlsx" onClick={() => exportDeckToXLSX()}>
          Excel
        </Menu.Item>
      </Menu>
    ),
    [selectedBanner, selectedCards, selectedShrine, selectedSquads, deckName]
  );

  const exportDeckToODS = useCallback(() => {
    const fileWithInfo = deckExporter(
      selectedCards,
      selectedSquads,
      deckName,
      selectedBanner,
      selectedShrine,
      "ods"
    );
    saveAs(fileWithInfo.blob, fileWithInfo.fileName);
  }, [deckName, selectedBanner, selectedCards, selectedShrine, selectedSquads]);

  const exportDeckToXLSX = useCallback(() => {
    const fileWithInfo = deckExporter(
      selectedCards,
      selectedSquads,
      deckName,
      selectedBanner,
      selectedShrine,
      "xlsx"
    );
    saveAs(fileWithInfo.blob, fileWithInfo.fileName);
  }, [deckName, selectedBanner, selectedCards, selectedShrine, selectedSquads]);

  const copyDeckUrlToClipboard = useCallback(() => {
    const squads = getIdsFromList(selectedSquads);
    const cards = getIdsFromList(selectedCards);

    if (cards.length === 0) {
      message.error("Unable to share deck. You have not selected any cards");
      return;
    }

    if (squads.length === 0) {
      message.error("Unable to share deck. You have not selected any squads");
      return;
    }

    const url =
      `${window.location.origin}/deck?cards=${cards.toString()}` +
      `&squads=${squads.toString()}` +
      `&faction=${selectedFactionType}` +
      `&deckname=${encodeURIComponent(deckName)}`;

    copy(url, {
      debug: true,
      message: "Press #{key} to copy",
    });

    message.success(`${url} was copied to your clipboard`);
  }, [deckName, selectedCards, selectedFactionType, selectedSquads]);

  return (
    <>
      <div className="site-card-wrapper">
        <Space>
          <Button key="new" size="small" onClick={newDeck}>
            New deck
          </Button>
          <Button key="share" size="small" onClick={copyDeckUrlToClipboard}>
            Share deck url
          </Button>

          <Dropdown overlay={exportMenu} placement="bottomLeft">
            <Button key="export" size="small">
              Export to file
            </Button>
          </Dropdown>

          <SaveDeck
            savedDecks={savedDecks}
            loadDeck={loadDeck}
            factions={factions}
          />
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
            />
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
            />
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
        />
      </div>
    </>
  );
}
