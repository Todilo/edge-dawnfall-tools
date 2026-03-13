import { useEffect } from "react";
import { Button, Card, Popover, Radio, Select, Typography } from "antd";

import type { Card as DeckCard, Faction, Squad } from "../types";
import "./squad-selector.css";

const { Option } = Select;

interface SquadSelectorProps {
  selectedSquads: Squad[];
  selectedCards: DeckCard[];
  setAlertMessage: (caller: string, message: string) => void;
  addSquad: (id: number) => void;
  removeSquad: (id: number) => void;
  changeFaction: (factionType: string) => void;
  factions: Faction[];
  selectedFaction: Faction;
  readonly: boolean;
  setBanner: (banner: string) => void;
  setShrine: (shrine: string) => void;
  selectedBanner: string;
  selectedShrine: string;
}

function getNumberOfSelectedUnits(selectedSquads: Squad[]) {
  return selectedSquads.reduce((previous, current) => previous + current.count, 0);
}

function renderSquadPreview(cardSource?: string, cardBackSource?: string) {
  return (
    <>
      {cardSource ? (
        <img className="squad-selector__card-image" src={cardSource} alt="" />
      ) : null}
      {cardBackSource ? (
        <img
          className="squad-selector__card-image"
          src={cardBackSource}
          alt=""
        />
      ) : null}
    </>
  );
}

function renderBannerPopover(
  frontSource: string,
  frontLabel: string,
  backSource?: string,
  backLabel?: string
) {
  return (
    <div className="squad-selector__banner-popover">
      <figure className="squad-selector__card-image-holder">
        <img className="squad-selector__card-image" src={frontSource} alt="" />
        <figcaption>{frontLabel}</figcaption>
      </figure>
      {backSource ? (
        <figure className="squad-selector__card-image-holder">
          <img className="squad-selector__card-image" src={backSource} alt="" />
          <figcaption>{backLabel}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}

function getCompatibilityMessage(
  selectedCards: DeckCard[],
  selectedSquads: Squad[]
) {
  const selectedDeckCards = selectedCards.filter((card) => card.count > 0);
  if (selectedDeckCards.length === 0) {
    return "";
  }

  const missingSquads = selectedDeckCards.reduce<string[]>((missing, card) => {
    const squad = selectedSquads.find(
      (selectedSquad) =>
        selectedSquad.type === card.squad && selectedSquad.count === 0
    );

    if (squad && !missing.includes(squad.name)) {
      missing.push(squad.name);
    }

    return missing;
  }, []);

  if (missingSquads.length === 0) {
    return "";
  }

  return `Your deck and squad is not compatible. Missing squads.${missingSquads
    .map((squad) => `\n${squad}`)
    .join("")}`;
}

export default function SquadSelector({
  selectedSquads,
  selectedCards,
  setAlertMessage,
  addSquad,
  removeSquad,
  changeFaction,
  factions,
  selectedFaction,
  readonly,
  setBanner,
  setShrine,
  selectedBanner,
  selectedShrine,
}: SquadSelectorProps) {
  const numberOfSelectedUnits = getNumberOfSelectedUnits(selectedSquads);

  useEffect(() => {
    setAlertMessage(
      "squadSelector",
      getCompatibilityMessage(selectedCards, selectedSquads)
    );
  }, [selectedCards, selectedSquads, setAlertMessage]);

  return (
    <Card title="Squads" type="inner" bordered>
      <div className="squad-selector__faction-select">
        <Select
          disabled={readonly}
          placeholder="Faction"
          style={{ width: 120 }}
          onChange={changeFaction}
          value={selectedFaction.type}
        >
          {factions.map((faction) => (
            <Option key={faction.type} value={faction.type}>
              {faction.name}
            </Option>
          ))}
        </Select>
      </div>
      <Typography>
        Begin by selecting 5 squads from your chosen faction. You can have
        multiple squads of some squad types.
        <br />
        <br />
      </Typography>
      <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>
        {numberOfSelectedUnits} / 5 - Selected units
      </span>
      {selectedSquads.length ? (
        selectedSquads.map((squad) => (
          <div className="squad-selector__squad" key={squad.id}>
            {!readonly && (
              <Button
                size="small"
                type="primary"
                style={{
                  backgroundColor: squad.count > 0 ? "red" : "transparent",
                  borderColor: "red",
                }}
                ghost={squad.count === 0}
                onClick={() => removeSquad(squad.id)}
                disabled={squad.count === 0}
              >
                -
              </Button>
            )}
            <Popover
              content={renderSquadPreview(squad.img, squad.imgBack)}
              trigger="hover"
              placement="right"
            >
              <Button size="small" className="squad-selector__squad-button">
                <span style={{ float: "left" }}>
                  {squad.count} / {squad.cardCount}
                </span>
                <span>
                  {squad.name} {squad.isElite ? "(elite)" : ""}{" "}
                  {squad.isCavalry ? "(cavalry)" : ""}
                  {squad.isBoss ? "(boss)" : ""}
                </span>
              </Button>
            </Popover>
            {!readonly && (
              <Button
                size="small"
                type="primary"
                onClick={() => addSquad(squad.id)}
                ghost={
                  squad.cardCount === squad.count || numberOfSelectedUnits >= 5
                }
                disabled={
                  squad.cardCount === squad.count || numberOfSelectedUnits >= 5
                }
              >
                +
              </Button>
            )}
          </div>
        ))
      ) : (
        <div />
      )}
      <div className="squad-select__generic-card-popover">
        <Radio.Group
          optionType="button"
          onChange={(event) => setBanner(event.target.value)}
          value={selectedBanner}
        >
          <Popover
            content={renderBannerPopover(
              selectedFaction.bannerFrontImageSrc,
              "Front",
              selectedFaction.bannerBackImageSrc,
              "Back"
            )}
            trigger="hover"
            placement="bottom"
          >
            <Radio.Button value="regular">
              <span>Banner</span>
            </Radio.Button>
          </Popover>
          <Popover
            content={renderBannerPopover(
              selectedFaction.bannerAlternativeFront,
              "Front",
              selectedFaction.bannerAlternativeBack,
              "Back"
            )}
            trigger="hover"
            placement="bottom"
          >
            <Radio.Button
              value="alternative"
              className="squad-selector__faction-alternative-button"
            >
              <span>Alt. banner</span>
            </Radio.Button>
          </Popover>
        </Radio.Group>
        <Radio.Group
          onChange={(event) => setShrine(event.target.value)}
          value={selectedShrine}
        >
          <Popover
            content={renderBannerPopover(selectedFaction.shrine, "Regular")}
            trigger="hover"
            placement="bottom"
          >
            <Radio.Button
              value="regular"
              className="squad-selector__faction-alternative-button"
            >
              <span>Shrine</span>
            </Radio.Button>
          </Popover>
          <Popover
            content={renderBannerPopover(
              selectedFaction.shrineAlternative,
              "Alternative"
            )}
            trigger="hover"
            placement="bottom"
          >
            <Radio.Button
              value="alternative"
              className="squad-selector__faction-alternative-button"
            >
              <span>Alt. Shrine</span>
            </Radio.Button>
          </Popover>
        </Radio.Group>
      </div>
    </Card>
  );
}
