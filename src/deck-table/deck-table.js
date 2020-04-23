import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Popover, Button } from "antd";
var content = (cardSource) => (
  <div>
    <img className="deck-table__card-image" src={cardSource} alt="" />
  </div>
);
function DeckTable({ squadTypes, selectedCards, readonly, dispatchCards }) {
  const [columns, setColumns] = useState([
    {
      title: "Collection",
      key: "id",
      className: "deck-table__collection-cell",
      width: 100,
      align: "center",
      render: (text, record) => (
        <div>
          {!readonly && (
            <Button
              type="link"
              size="small"
              onClick={() => dispatchCards({ type: "remove", id: record.id })}
              disabled={record.count === 0}
            >
              -
            </Button>
          )}
          <span>
            {record.count || 0} /{record.cardCount}{" "}
          </span>

          {!readonly && (
            <Button
              type="link"
              size="small"
              onClick={() => dispatchCards({ type: "add", id: record.id })}
              disabled={record.cardCount === record.count}
            >
              +
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Card",
      dataIndex: "lowerAction",
      key: "id",
      sorter: (a, b) => a.lowerAction < b.lowerAction,
      render: (text, record) => (
        <Popover
          content={content(record.img)}
          trigger="hover"
          placement="right"
        >
          <Button type="link">{record.lowerAction}</Button>
        </Popover>
      ),
    },
    {
      title: "Squad",
      dataIndex: "squad",
      key: "squad",
      filters: [{ a: "asdf" }],
      filterMultiple: true,
      defaultSortOrder: "descend",
      sorter: (a, b) => a.squad < b.squad,
      onFilter: (value, record) => record.squad.indexOf(value) === 0,
      render: (text, record) => {
        var squad = squadTypes.find((squad) => squad.type === record.squad);
        if (typeof squad === "undefined" || squad === null) {
          return <div>undefined</div>;
        }
        return <div>{squad.name}</div>;
      },
    },
    {
      title: "Type",
      dataIndex: "costType",
      filters: [
        {
          text: "Crystal",
          value: "crystal",
        },
        {
          text: "Charge",
          value: "charge",
        },
      ],
      filterMultiple: false,
      render: (text, record) => (
        <span>
          <img
            className="deck-table__cost-type"
            alt="Cost type"
            src={
              record.costType === "crystal" ? "./crystal.png" : "./charge.png"
            }
          />
        </span>
      ),
      onFilter: (value, record) => record.costType.indexOf(value) === 0,
    },
    {
      title: "Cost",
      dataIndex: "upperCost",
      key: "id",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.upperCost - b.upperCost,
      filters: [
        {
          text: "0",
          value: 0,
        },
        {
          text: "1",
          value: 1,
        },
        {
          text: "2",
          value: 2,
        },
      ],
    },
    {
      title: "Upper action",
      dataIndex: "upperActionText",
      key: "id",
      render: (text, record) => (
        <p>
          {record.upperAction} - {replaceSpecialSymbols(record.upperActionText)}
        </p>
      ),
    },

    {
      title: "Cost",
      dataIndex: "lowerCost",
      defaultSortOrder: "descend",
      key: "id",
      sorter: (a, b) => a.lowerCost - b.lowerCost,
    },
    {
      title: "Lower action",
      dataIndex: "lowerActionText",
      key: "id",
      render: (text, record) => (
        <p>
          {record.lowerAction} - {replaceSpecialSymbols(record.lowerActionText)}
        </p>
      ),
    },
  ]);

  const replaceSpecialSymbols = (text) => {
    var splitText = text.split(/(\(base_to_base\)|\(crystal\)|\(charge\))/);
    return splitText.map((str, i) => {
      if (str === "(base_to_base)") {
        return (
          <img
            key={i}
            alt="base to base icon"
            src="./base_to_base_gray.png"
            style={{ height: "14px" }}
          ></img>
        );
      } else if (str === "(crystal)") {
        return (
          <img
            key={i}
            alt="crystal icon"
            src="./crystal.png"
            style={{ height: "14px" }}
          ></img>
        );
      } else if (str === "(charge)") {
        return (
          <img
            key={i}
            alt="charge icon"
            src="./charge.png"
            style={{ height: "14px" }}
          ></img>
        );
      } else {
        return <span key={i}>{str}</span>;
      }
    });
  };
  useEffect(() => {
    // Generate filters
    var squadFilter = selectedCards
      .map((card) => {
        return {
          text: squadTypes.find((squadType) => squadType.type === card.squad)
            .name,
          value: card.squad,
        };
      })
      .sort((a, b) => a.type > b.type);
    squadFilter = squadFilter.filter(
      (e, i) => squadFilter.findIndex((a) => a["value"] === e["value"]) === i
    );
    setColumns((prevColumns) =>
      prevColumns.map((item, index) =>
        index === 2
          ? {
              ...item,
              filters: squadFilter,
            }
          : item
      )
    );
  }, [selectedCards, squadTypes]);

  return <Table columns={columns} dataSource={selectedCards} />;
}

export default DeckTable;

DeckTable.whyDidYouRender = false;
