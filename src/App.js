// Styling
import "./App.css";

import React from "react";
import { Layout, Typography } from "antd";

// Own components
// import SidebarMenu from "./sidebar-menu/sidebar-menu";
import { DeckPage } from "./pages/";
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
            <Layout style={{ padding: 0 }}>
              <Content>
                <Switch>
                  <Route exact path="/">
                    <DeckPage></DeckPage>
                  </Route>
                  <Route path="/deck">
                    <DeckPage readonly></DeckPage>
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
