// Styling
import "./App.css";

import React from "react";
import { Layout, Typography } from "antd";

// Own components
// import SidebarMenu from "./sidebar-menu/sidebar-menu";
import {
  DeckPage,
  ExtraResourcesPage,
  CampaignTracker,
  EditorPage,
} from "./pages/";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

export default function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Header className="header-container">
            <Title
              style={{ color: "white", textAlign: "left", padding: "0 20px" }}
              level={3}
            >
              Edge Dawnfall Toolbox
            </Title>
          </Header>
          <Layout>
            {/* <Sider breakpoint="lg" collapsedWidth="0">
              <SidebarMenu />
            </Sider> */}
            <Layout style={{ padding: 0 }}>
              <Content>
                <Switch>
                  <Route exact path="/">
                    <DeckPage readonly={false}></DeckPage>
                  </Route>
                  <Route path="/deck">
                    <DeckPage readonly={true}></DeckPage>
                  </Route>
                  <Route path="/campaign">
                    <CampaignTracker />
                  </Route>
                  <Route path="/extra-resources">
                    <ExtraResourcesPage />
                  </Route>
                  <Route path="/editor-page">
                    <EditorPage />
                  </Route>
                </Switch>
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Edge Dawnfall Toolbox Created by Todilo. Post any feedback to
                todilo87+edgedawnfall (at) gmail . com
              </Footer>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    </div>
  );
}
