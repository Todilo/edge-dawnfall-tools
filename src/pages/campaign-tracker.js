import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";
import { Layout, Card, Modal } from "antd";

const Sticker = (props) => {
  const [image] = useImage(window.origin + "/images/campaign/stickers/w07.png");
  return <Image {...props} props image={image} />;
};

const Map = () => {
  const [image] = useImage(window.origin + "/images/campaign/maps/basic.jpg");
  return <Image image={image} />;
};

const test = () => {
  console.log("over");
};

export default function CampaignTracker() {
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {}, []);
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.12;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStageScale(newScale);
    setStagePosition({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  const handleOk = (e) => {
    console.log(e);
    setShowModal(false);
  };

  const handleCancel = (e) => {
    console.log(e);
    setShowModal(false);
  };

  return (
    <Layout>
      <Modal
        title="Select Sticker"
        visible={showModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
          <img
            key={val}
            src={"images/campaign/stickers/w07.png"}
            alt="sticker w07"
            width="80"
            style={{
              borderRadius: "18px",
              margin: "5px",
              border: "2px ridge #372626",
            }}
          />
        ))}
      </Modal>

      <div className="site-card-wrapper">
        <Card title="Squads" type="inner" bordered={true}>
          test
        </Card>
      </div>

      <div className="site-card-wrapper">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onWheel={handleWheel}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePosition.x}
          y={stagePosition.y}
          draggable={true}
        >
          <Layer>
            <Map />
            <Rect
              x={32}
              y={32}
              width={82}
              height={100}
              opacity={0.5}
              fill="red"
              shadowBlur={10}
              onMouseOver={test}
              onMouseUp={() => setShowModal(true)}
            />

            <Sticker
              shadowColor="black"
              shadowBlur={20}
              shadowOpacity={0.8}
              width={82}
              height={100}
              opacity={0.8}
              x={376}
              y={32}
              draggable={true}
              onDragEnd={(e) => {
                console.log({ x: e.target.x(), y: e.target.y() });
              }}
              cursor="pointer"
            />

            <Sticker
              shadowColor="black"
              shadowBlur={20}
              shadowOpacity={0.8}
              width={82}
              height={100}
              x={289}
              y={32}
              draggable={true}
              onDragEnd={(e) => {
                console.log({ x: e.target.x(), y: e.target.y() });
              }}
            />
          </Layer>
        </Stage>
      </div>
    </Layout>
  );
}
