import React, { useEffect } from "react";
import { Button, Card, Typography, Popover, Select } from "antd";

import "./squad-selector.css";
const { Option } = Select;

function SquadSelector({
  selectedSquads,
  selectedCards,
  setAlertMessage,
  dispatchSquads,
  changeFaction,
  factions,
  selectedFaction,
  readonly,
}) {
  const numberOfSelectedUnits = () => {
    return selectedSquads.length > 0
      ? selectedSquads.reduce((previous, current) => {
          return previous + current.count;
        }, 0)
      : 0;
  };

  useEffect(() => {
    var selectedDeckCards = selectedCards.filter((card) => card.count > 0);

    if (selectedDeckCards.length > 0) {
      var anyCard = selectedDeckCards.reduce((missing, card) => {
        var find = selectedSquads.find(
          (squad) => squad.type === card.squad && squad.count === 0
        );
        if (typeof find !== "undefined" && missing.indexOf(find.name) === -1) {
          missing.push(find.name);
        }
        return missing;
      }, []);

      if (anyCard.length > 0) {
        var message =
          "Your deck and squad is not compatible. Missing squads." +
          anyCard.map((card) => "\n" + card);
        setAlertMessage("squadSelector", message);
      } else {
        setAlertMessage("squadSelector", "");
      }
    } else {
      setAlertMessage("squadSelector", "");
    }
  }, [selectedCards, selectedSquads, setAlertMessage]);

  const content = (cardSource, cardBackSource) => (
    <div>
      <img className="squad-selector__card-image" src={cardSource} alt="" />
      <img className="squad-selector__card-image" src={cardBackSource} alt="" />
    </div>
  );

  const bannerImagePopoverContent = (
    frontSource,
    frontLabel,
    backSource,
    backLabel
  ) => (
    <div className="squad-selector__banner-popover">
      <figure className="squad-selector__card-image-holder">
        <img className="squad-selector__card-image" src={frontSource} alt="" />
        <figcaption>{frontLabel}</figcaption>
      </figure>
      {backSource && (
        <figure className="squad-selector__card-image-holder">
          <img className="squad-selector__card-image" src={backSource} alt="" />
          <figcaption>{backLabel}</figcaption>
        </figure>
      )}
    </div>
  );

  return (
    <Card title="Squads" type="inner" bordered={true}>
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
        multiple squads of some squad types.<br></br>
        <br></br>
      </Typography>
      <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>
        {numberOfSelectedUnits()} / 5 - Selected units
      </span>
      {selectedSquads.length ? (
        selectedSquads.map((squad, index) => (
          <div className="squad-selector__squad" key={squad.id}>
            {!readonly && (
              <Button
                size="small"
                type="primary"
                style={{ backgroundColor: "red", borderColor: "red" }}
                ghost={squad.count === 0}
                onClick={() => dispatchSquads({ type: "remove", id: squad.id })}
                disabled={squad.count === 0}
              >
                -
              </Button>
            )}
            <Popover
              content={content(squad.img, squad.imgBack)}
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
                </span>
              </Button>
            </Popover>
            {!readonly && (
              <Button
                size="small"
                type="primary"
                onClick={() => dispatchSquads({ type: "add", id: squad.id })}
                ghost={
                  squad.cardCount === squad.count ||
                  numberOfSelectedUnits() >= 5
                }
                disabled={
                  squad.cardCount === squad.count ||
                  numberOfSelectedUnits() >= 5
                }
              >
                +
              </Button>
            )}
          </div>
        ))
      ) : (
        <div></div>
      )}
      <div className="squad-select__generic-card-popover">
        <Popover
          content={bannerImagePopoverContent(
            selectedFaction.bannerFrontImageSrc,
            "Front",
            selectedFaction.bannerBackImageSrc,
            "Back"
          )}
          trigger="hover"
          placement="bottom"
        >
          <Button size="medium">
            <span>Banner</span>
          </Button>
        </Popover>
        <Popover
          content={bannerImagePopoverContent(
            selectedFaction.bannerAlternativeFront,
            "Front",
            selectedFaction.bannerAlternativeBack,
            "Back"
          )}
          trigger="hover"
          placement="bottom"
        >
          <Button
            size="medium"
            className="squad-selector__faction-alternative-button"
          >
            <span>Alternative banner</span>
          </Button>
        </Popover>
        <Popover
          content={bannerImagePopoverContent(
            selectedFaction.shrine,
            "Regular",
            selectedFaction.shrineAlternative,
            "Alternative"
          )}
          trigger="hover"
          placement="bottom"
        >
          <Button
            size="medium"
            className="squad-selector__faction-alternative-button"
          >
            <span>Shrine</span>
          </Button>
        </Popover>
      </div>
    </Card>
  );
}

SquadSelector.whyDidYouRender = true;
export default React.memo(SquadSelector);
