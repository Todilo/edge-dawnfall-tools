import "../deck-table/deck-table.css";

import { useCallback, useEffect, useMemo } from "react";
import { Button, Col, Dropdown, Menu, message, Row, Space } from "antd";
import copy from "copy-to-clipboard";
import { saveAs } from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";

import Deck from "../deck/deck";
import SaveDeck from "../deck/save-deck";
import DeckTable from "../deck-table/deck-table";
import DisplayMessages from "../display-messages/display-messages";
import { ROOT_PATH, SHARED_DECK_PATH } from "../deck/constants";
import { factions } from "../factions";
import SquadSelector from "../squad-selector/squad-selector";
import { squadTypes } from "../squadTypes";
import { useDeckActions, useDeckViewState } from "../stores/deck-store";

interface DeckPageProps {
  readonly?: boolean;
}

export default function DeckPage({ readonly = false }: DeckPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    alertMessages,
    deckId,
    deckName,
    savedDecks,
    selectedBanner,
    selectedCards,
    selectedFaction,
    selectedShrine,
    selectedSquads,
  } = useDeckViewState();
  const {
    initialize,
    loadDeck,
    loadSharedDeck,
    addCard,
    removeCard,
    addSquad,
    removeSquad,
    resetDeck,
    saveAsDeck,
    saveDeck,
    setAlertMessage,
    setBanner,
    setDeckName,
    setShrine,
    changeFaction,
  } = useDeckActions();

  const isDeckLocked = readonly || Number(deckId) < 50;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (location.pathname !== SHARED_DECK_PATH) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const cardIds = searchParams
      .get("cards")
      ?.split(",")
      .filter(Boolean)
      .map(Number);
    const squadIds = searchParams
      .get("squads")
      ?.split(",")
      .filter(Boolean)
      .map(Number);
    const factionType = searchParams.get("faction");
    const sharedDeckName = searchParams.get("deckname");

    if (!cardIds?.length || !squadIds?.length || !factionType) {
      return;
    }

    loadSharedDeck({
      cardIds,
      squadIds,
      factionType,
      deckName: sharedDeckName,
    });
  }, [loadSharedDeck, location.pathname, location.search]);

  const handleFactionChange = useCallback(
    (factionType: string) => {
      if (location.pathname === SHARED_DECK_PATH) {
        navigate(ROOT_PATH, { replace: true });
      }

      changeFaction(factionType);
    },
    [changeFaction, location.pathname, navigate]
  );

  const handleNewDeck = useCallback(() => {
    navigate(ROOT_PATH, { replace: true });
    resetDeck(selectedFaction.type);
  }, [navigate, resetDeck, selectedFaction.type]);

  const handleLoadDeck = useCallback(
    (id: string | number) => {
      if (loadDeck(id)) {
        navigate(ROOT_PATH, { replace: true });
      }
    },
    [loadDeck, navigate]
  );

  const handleSaveDeck = useCallback(() => {
    const result = saveDeck();

    if (!result.ok) {
      message.error("Can not save deck, please set a name.");
      return;
    }

    navigate(ROOT_PATH, { replace: true });
  }, [navigate, saveDeck]);

  const handleSaveAsDeck = useCallback(() => {
    const result = saveAsDeck();

    if (!result.ok) {
      message.error("Can not save deck, please set a name.");
      return;
    }

    navigate(ROOT_PATH, { replace: true });
  }, [navigate, saveAsDeck]);

  const exportDeck = useCallback(async (documentType: "ods" | "xlsx") => {
    const { default: exportDeckWorkbook } = await import("../deckExporter");
    const fileWithInfo = exportDeckWorkbook(
      selectedCards,
      selectedSquads,
      deckName,
      selectedBanner,
      selectedShrine,
      documentType
    );
    saveAs(fileWithInfo.blob, fileWithInfo.fileName);
  }, [deckName, selectedBanner, selectedCards, selectedShrine, selectedSquads]);

  const exportMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item key="shareods" onClick={() => void exportDeck("ods")}>
          ODS
        </Menu.Item>
        <Menu.Item key="sharexlsx" onClick={() => void exportDeck("xlsx")}>
          Excel
        </Menu.Item>
      </Menu>
    ),
    [exportDeck]
  );

  const copyDeckUrlToClipboard = useCallback(() => {
    const squads = selectedSquads.flatMap((squad) =>
      Array.from({ length: squad.count }, () => squad.id)
    );
    const cards = selectedCards.flatMap((card) =>
      Array.from({ length: card.count }, () => card.id)
    );

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
      `&faction=${selectedFaction.type}` +
      `&deckname=${encodeURIComponent(deckName)}`;

    copy(url, {
      debug: true,
      message: "Press #{key} to copy",
    });

    message.success(`${url} was copied to your clipboard`);
  }, [deckName, selectedCards, selectedFaction.type, selectedSquads]);

  return (
    <>
      <div className="site-card-wrapper">
        <Space>
          <Button key="new" size="small" onClick={handleNewDeck}>
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
            loadDeck={handleLoadDeck}
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
              addSquad={addSquad}
              removeSquad={removeSquad}
              changeFaction={handleFactionChange}
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
              saveDeck={handleSaveDeck}
              saveAsDeck={handleSaveAsDeck}
              addCard={addCard}
              removeCard={removeCard}
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
          addCard={addCard}
          removeCard={removeCard}
        />
      </div>
    </>
  );
}
