import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

import DeckIcon from "../icons/deck-icon";
import CampaignMapIcon from "../icons/campaign-map-icon";
import { ContainerOutlined } from "@ant-design/icons";

export default function SidebarMenu() {
  const [selectedKeysFomUrl, setSelectedKeys] = useState([]);
  const location = useLocation();

  useEffect(() => {
    var path =
      location.pathname === "/" || location.pathname === "/deck"
        ? "root"
        : location.pathname;
    setSelectedKeys(path);
  }, [location]);

  return (
    <Menu selectedKeys={selectedKeysFomUrl} mode="inline" theme="dark">
      <Menu.Item key="root">
        <DeckIcon />
        Deckbuilder
        <Link to="/" />
      </Menu.Item>
      <Menu.Item key="/campaign">
        <CampaignMapIcon />
        Campaign Tracker
        <Link to="/campaign" />
      </Menu.Item>
      <Menu.Item key="/extra-resources">
        <ContainerOutlined />
        <span>Option 3</span>
        <Link to="/extra-resources" />
      </Menu.Item>
      <Menu.Item key="/editor.page">
        <ContainerOutlined />
        <span>Editor page</span>
        <Link to="/editor-page" />
      </Menu.Item>
    </Menu>
  );
}
