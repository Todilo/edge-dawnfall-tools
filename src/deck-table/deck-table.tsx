import { useMemo } from "react";
import { Button, Popover, Table } from "antd";
import type { ColumnsType } from "antd/lib/table";

import type { Card, Squad } from "../types";

interface DeckTableProps {
  squadTypes: Squad[];
  selectedCards: Card[];
  readonly: boolean;
  addCard: (id: number) => void;
  removeCard: (id: number) => void;
}

function renderCardPreview(cardSource: string) {
  return (
    <div>
      <img className="deck-table__card-image" src={cardSource} alt="" />
    </div>
  );
}

function costTypeToImageSrc(costType: string) {
  switch (costType) {
    case "crystal":
      return "./crystal.png";
    case "charge":
      return "./charge.png";
    case "darkness":
      return "./dark_point.png";
    default:
      return "";
  }
}

function replaceSpecialSymbols(text: string) {
  return text.split(/(\(base_to_base\)|\(crystal\)|\(charge\))/).map((part, index) => {
    if (part === "(base_to_base)") {
      return (
        <img
          key={index}
          alt="base to base icon"
          src="./base_to_base_gray.png"
          style={{ height: "14px" }}
        />
      );
    }

    if (part === "(crystal)") {
      return (
        <img
          key={index}
          alt="crystal icon"
          src="./crystal.png"
          style={{ height: "14px" }}
        />
      );
    }

    if (part === "(charge)") {
      return (
        <img
          key={index}
          alt="charge icon"
          src="./charge.png"
          style={{ height: "14px" }}
        />
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export default function DeckTable({
  squadTypes,
  selectedCards,
  readonly,
  addCard,
  removeCard,
}: DeckTableProps) {
  const squadFilters = useMemo(
    () =>
      selectedCards
        .map((card) => {
          const squad = squadTypes.find((item) => item.type === card.squad);
          return squad ? { text: squad.name, value: card.squad } : null;
        })
        .filter((item): item is { text: string; value: string } => Boolean(item))
        .filter(
          (item, index, allItems) =>
            allItems.findIndex((candidate) => candidate.value === item.value) ===
            index
        )
        .sort((left, right) => left.text.localeCompare(right.text)),
    [selectedCards, squadTypes]
  );

  const columns = useMemo<ColumnsType<Card>>(
    () => [
      {
        title: "Collection",
        key: "collection",
        className: "deck-table__collection-cell",
        width: 100,
        align: "center",
        render: (_, record) => (
          <div>
            {!readonly && (
              <Button
                type="link"
                size="small"
                onClick={() => removeCard(record.id)}
                disabled={record.count === 0}
              >
                -
              </Button>
            )}
            <span>
              {record.count} /{record.cardCount}{" "}
            </span>

            {!readonly && (
              <Button
                type="link"
                size="small"
                onClick={() => addCard(record.id)}
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
        key: "card",
        sorter: (left, right) => left.lowerAction.localeCompare(right.lowerAction),
        render: (_, record) => (
          <Popover
            content={renderCardPreview(record.img)}
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
        filters: squadFilters,
        filterMultiple: true,
        sorter: (left, right) => left.squad.localeCompare(right.squad),
        onFilter: (value, record) => record.squad.indexOf(String(value)) === 0,
        render: (_, record) => {
          const squad = squadTypes.find((item) => item.type === record.squad);
          return <div>{squad?.name ?? "undefined"}</div>;
        },
      },
      {
        title: "Type",
        dataIndex: "costType",
        key: "type",
        filters: [
          { text: "Crystal", value: "crystal" },
          { text: "Charge", value: "charge" },
        ],
        filterMultiple: false,
        render: (_, record) => (
          <span>
            <img
              className="deck-table__cost-type"
              alt="Cost type"
              src={costTypeToImageSrc(record.costType)}
            />
          </span>
        ),
        onFilter: (value, record) => record.costType.indexOf(String(value)) === 0,
      },
      {
        title: "Cost",
        dataIndex: "upperCost",
        key: "upperCost",
        sorter: (left, right) => Number(left.upperCost) - Number(right.upperCost),
        filters: [
          { text: "0", value: 0 },
          { text: "1", value: 1 },
          { text: "2", value: 2 },
        ],
      },
      {
        title: "Upper action",
        dataIndex: "upperActionText",
        key: "upperActionText",
        render: (_, record) => (
          <p>
            {record.upperAction} - {replaceSpecialSymbols(record.upperActionText)}
          </p>
        ),
      },
      {
        title: "Cost",
        dataIndex: "lowerCost",
        key: "lowerCost",
        sorter: (left, right) => Number(left.lowerCost) - Number(right.lowerCost),
      },
      {
        title: "Lower action",
        dataIndex: "lowerActionText",
        key: "lowerActionText",
        render: (_, record) => (
          <p>
            {record.lowerAction} - {replaceSpecialSymbols(record.lowerActionText)}
          </p>
        ),
      },
    ],
    [addCard, readonly, removeCard, squadFilters, squadTypes]
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={selectedCards}
      pagination={false}
      scroll={{ x: true }}
    />
  );
}
